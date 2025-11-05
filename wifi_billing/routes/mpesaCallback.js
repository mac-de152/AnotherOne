const express = require("express");
const prisma = require("../config/prismaClient");
const { whitelistMAC } = require("../config/mikrotik");

const router = express.Router();

router.post("/mpesa/callback", async (req, res) => {
  console.log("📲 M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

  const callbackData = req.body?.Body?.stkCallback;
  const checkoutId = callbackData?.CheckoutRequestID;
  const resultCode = callbackData?.ResultCode;

  if (!callbackData || !checkoutId) {
    return res.status(400).json({ success: false, error: "Invalid callback payload" });
  }

  if (resultCode !== 0) {
    // Mark failed using parameterized query
    try {
      await prisma.payment.updateMany({
        where: { mpesaRef: checkoutId },
        data: { status: "failed" }
      });
      return res.json({ success: false, message: "Payment failed or canceled" });
    } catch (error) {
      console.error("❌ Failed to update payment status:", error);
      return res.status(500).json({ success: false, error: "Failed to update payment status" });
    }
  }

  const amount = callbackData?.CallbackMetadata?.Item?.find((item) => item.Name === "Amount")?.Value;
  const mpesaRef = callbackData?.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value;

  try {
    // Fetch MAC address using parameterized query
    const payment = await prisma.payment.findFirst({
      where: { mpesaRef: checkoutId },
      select: { macAddress: true }
    });
    if (!payment || !payment.macAddress) {
      console.error("❌ Transaction not found for checkout ID:", checkoutId);
      return res.status(500).json({ success: false, error: "Transaction not found" });
    }
    const mac = payment.macAddress;
    let time = "1Hr";
    if (Number(amount) === 30) time = "24Hrs";
    else if (Number(amount) === 20) time = "12Hrs";
    else if (Number(amount) === 15) time = "4Hrs";

    console.log(`✅ Whitelisting MAC ${mac} for ${time}...`);

    const mikrotikResponse = await whitelistMAC(mac, time);

    if (mikrotikResponse.success) {
      // Update payment status using parameterized query
      await prisma.payment.updateMany({
        where: { mpesaRef: checkoutId },
        data: {
          status: "completed",
          mpesaRef: mpesaRef || checkoutId || null,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });
      return res.json({ success: true, message: mikrotikResponse.message });
    } else {
      console.error("❌ MikroTik Error:", mikrotikResponse.message);
      return res.status(500).json({ success: false, error: "MikroTik whitelist failed" });
    }
  } catch (error) {
    console.error("❌ Database Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
