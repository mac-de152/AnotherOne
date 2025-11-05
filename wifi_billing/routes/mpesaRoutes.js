const express = require("express");
const axios = require("axios");
const prisma = require("../config/prismaClient");
const { stkPush } = require("../config/mpesa");

const router = express.Router();

// Daraja Mpesa configuration
const DARAJA_BASE_URL = "http://localhost:3000"; // Daraja Mpesa server

// Initiate payment - aligns with Frontend apiClient.initiatePayment
router.post("/payments/initiate", async (req, res) => {
  console.log("Payment initiate request received:", req.body);

  const { phone, amount, macAddress, package: pkg, speed } = req.body || {};

  if (!phone || !amount || !macAddress) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  // Accept +2547XXXXXXXX or 2547XXXXXXXX
  const normalizedPhone = phone.startsWith("+") ? phone.slice(1) : phone;
  if (!/^2547\d{8}$/.test(normalizedPhone)) {
    return res.status(400).json({ success: false, error: "Invalid phone number. Use 2547XXXXXXXX format." });
  }

  const transactionId = `TXN_${Date.now()}`;

  // Create payment record in database
  try {
    await prisma.payment.create({
      data: {
        phone: normalizedPhone,
        amount: Number(amount),
        transactionId,
        macAddress,
        status: "pending"
      }
    });
  } catch (dbError) {
    console.error("Database error creating payment:", dbError);
    return res.status(500).json({ success: false, error: "Database error" });
  }

  // Use real MPesa STK Push
  console.log(`Initiating STK Push: Phone: ${normalizedPhone}, Amount: ${amount}`);
  try {
    const stkResponse = await stkPush(normalizedPhone, amount, transactionId);
    if (!stkResponse) {
      // Mark payment as failed in database
      try {
        await prisma.payment.update({
          where: { transactionId },
          data: { status: "failed" }
        });
      } catch (dbError) {
        console.error("Failed to update payment status:", dbError);
      }
      return res.status(500).json({ success: false, error: "STK Push failed. No response from MPesa API." });
    }

    // Persist CheckoutRequestID for callback correlation
    try {
      const checkoutId = stkResponse.CheckoutRequestID || null;
      if (checkoutId) {
        await prisma.payment.update({
          where: { transactionId },
          data: { mpesaRef: checkoutId }
        });
      }
    } catch (e) {
      console.error("Failed to persist mpesa_ref:", e);
    }

    console.log("Returning success response for transaction:", transactionId);
    return res.json({
      success: true,
      data: {
        transactionId,
        mpesaRef: stkResponse.CheckoutRequestID || stkResponse.MerchantRequestID || null,
        status: "pending",
        expiresAt: null,
      },
      message: "STK Push sent!",
    });
  } catch (stkError) {
    console.error('STK Push Error:', stkError);

    // Mark payment as failed in database
    try {
      await prisma.payment.update({
        where: { transactionId },
        data: { status: "failed" }
      });
    } catch (dbError) {
      console.error("Failed to update payment status:", dbError);
    }

    return res.status(500).json({ success: false, error: "STK Push failed. No response from MPesa API." });
  }
});

// Check payment status - aligns with Frontend apiClient.checkPaymentStatus
router.get("/payments/status/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      select: { status: true, mpesaRef: true, expiresAt: true }
    });
    if (!payment) {
      return res.json({ success: true, data: { status: "pending", mpesaRef: null, expiresAt: null } });
    }
    return res.json({ success: true, data: {
      status: payment.status || "pending",
      mpesaRef: payment.mpesaRef,
      expiresAt: payment.expiresAt
    }});
  } catch (error) {
    console.error("/payments/status error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch payment status" });
  }
});

module.exports = router;
