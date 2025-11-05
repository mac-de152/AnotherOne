const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Config
const {
  ENVIRONMENT,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SHORTCODE,
  PASSKEY,
  CALLBACK_URL
} = process.env;

const baseURL =
  ENVIRONMENT === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke';

// Utils
function getTimestamp() {
  const date = new Date();
  return date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
}

function generatePassword(shortcode, passkey, timestamp) {
  return Buffer.from(shortcode + passkey + timestamp).toString('base64');
}

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const response = await axios.get(
    `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` }
    }
  );

  return response.data.access_token;
}

// POST /pay → STK Push
app.post('/pay', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required.' });
    }

    const timestamp = getTimestamp();
    const password = generatePassword(SHORTCODE, PASSKEY, timestamp);
    const access_token = await getAccessToken();

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: 'DENIS_PAY',
      TransactionDesc: 'Payment via STK Push'
    };

    const stkRes = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    console.log('✅ STK Push Sent:', stkRes.data);
    res.json({ message: 'STK Push Sent!', data: stkRes.data });
  } catch (error) {
    const errData = error.response?.data;
    console.error('❌ STK Push Error:', errData || error.message);
    res.status(500).json({
      error: 'Failed to initiate STK Push',
      details: errData || error.message
    });
  }
});

// POST /callback → M-Pesa Response
app.post('/callback', (req, res) => {
  console.log('📥 Callback received from M-Pesa:', JSON.stringify(req.body, null, 2));

  // TODO: Save to DB or log file
  res.sendStatus(200);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
