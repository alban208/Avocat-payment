const stripe = require('stripe')('your-stripe-secret-key');

async function createPaymentIntent(amount, currency) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

module.exports = {
  createPaymentIntent,
};
