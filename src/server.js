const express = require('express');
const bodyParser = require('body-parser');
const { createPaymentIntent } = require('./stripePayment');

const app = express();
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await createPaymentIntent(amount, currency);
    res.status(200).send(paymentIntent);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
