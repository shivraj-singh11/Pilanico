const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// ─── Razorpay instance ────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── ROUTES ───────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Pilanico Backend Running ✅", time: new Date() });
});

// POST /api/create-order
// Creates a Razorpay order - called when user clicks "Proceed To Pay"
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay takes paise (1 INR = 100 paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // Send key_id to frontend (public key only)
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

// POST /api/verify-payment
// Verifies Razorpay signature after payment - IMPORTANT for security
app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing payment fields" });
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.warn("⚠️  Signature mismatch - possible tampering!");
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }

    // ✅ Payment verified! Here you'd:
    // 1. Save order to your database
    // 2. Trigger delivery dispatch
    // 3. Send confirmation SMS/email

    console.log(`✅ Payment verified: ${razorpay_payment_id} for order ${razorpay_order_id}`);

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, error: "Verification error", details: err.message });
  }
});

// POST /api/webhook
// Razorpay webhooks (set this URL in Razorpay dashboard)
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("⚠️  Invalid webhook signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(req.body);
  console.log("Webhook event:", event.event);

  switch (event.event) {
    case "payment.captured":
      console.log("💰 Payment captured:", event.payload.payment.entity.id);
      // Update DB, send notification, dispatch order
      break;
    case "payment.failed":
      console.log("❌ Payment failed:", event.payload.payment.entity.id);
      // Notify user, cancel order
      break;
    case "order.paid":
      console.log("✅ Order paid:", event.payload.order.entity.id);
      break;
    default:
      console.log("Unhandled event:", event.event);
  }

  res.json({ received: true });
});

// GET /api/payment/:paymentId
// Fetch payment details
app.get("/api/payment/:paymentId", async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Pilanico Backend running on http://localhost:${PORT}`);
  console.log(`   Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? "✅ Set" : "❌ Missing (add to .env)"}`);
});
