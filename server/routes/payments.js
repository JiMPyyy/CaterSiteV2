const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createPaymentIntent, confirmPaymentIntent } = require('../services/stripeService');

// All routes are protected
router.use(protect);

// @desc    Create payment intent for order
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', async (req, res, next) => {
  try {
    const { amount, orderId, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    const metadata = {
      orderId: orderId || 'pending',
      customerEmail: customerEmail || req.user.email,
      userId: req.user._id.toString()
    };

    const result = await createPaymentIntent(amount, 'usd', metadata);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create payment intent',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Confirm payment status
// @route   GET /api/payments/confirm/:paymentIntentId
// @access  Private
router.get('/confirm/:paymentIntentId', async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;

    const result = await confirmPaymentIntent(paymentIntentId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to confirm payment',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        status: result.status,
        paymentIntent: result.paymentIntent
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
