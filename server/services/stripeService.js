const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent for order
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Confirm payment intent
const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent
    };
  } catch (error) {
    console.error('Stripe payment confirmation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create customer (optional - for future orders)
const createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    console.error('Stripe customer creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Refund payment (for order cancellations)
const refundPayment = async (paymentIntentId, amount = null) => {
  try {
    const refundData = { payment_intent: paymentIntentId };
    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundData);

    return {
      success: true,
      refundId: refund.id,
      status: refund.status
    };
  } catch (error) {
    console.error('Stripe refund failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  createCustomer,
  refundPayment
};
