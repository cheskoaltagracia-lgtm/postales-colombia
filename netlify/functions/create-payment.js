const Stripe = require('stripe');

const PRICE_PER_POSTCARD_CENTS = 300;
const MAX_QUANTITY = 50;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'STRIPE_SECRET_KEY missing in Netlify env vars' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const quantity = parseInt(body.quantity, 10);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Quantity must be an integer between 1 and ${MAX_QUANTITY}` })
      };
    }

    const stripe = Stripe(secret);
    const amount = quantity * PRICE_PER_POSTCARD_CENTS;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: 'Postales Colombia',
        quantity: String(quantity),
        fulfilled: 'false'
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amountCents: amount,
        quantity
      })
    };
  } catch (err) {
    console.error('create-payment error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
