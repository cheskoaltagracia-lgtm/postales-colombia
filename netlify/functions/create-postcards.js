const Stripe = require('stripe');

const PRICE_PER_POSTCARD_CENTS = 300;
const LOB_API_KEY = process.env.LOB_API_KEY;

const DEFAULT_FROM = {
  name: 'Postales Colombia',
  address_line1: 'Calle 85 #11-35',
  address_city: 'Bogota',
  address_state: 'Cundinamarca',
  address_zip: '110111',
  address_country: 'CO'
};

function validateRecipient(to) {
  return !!(to && to.name && to.address_line1 && to.address_city && to.address_zip && to.address_country);
}

async function createOnePostcardInLob(postcard) {
  const lobBody = {
    description: postcard.description || 'Postales Colombia',
    to: postcard.to,
    from: postcard.from || DEFAULT_FROM,
    front: postcard.front,
    message: postcard.message || '',
    size: postcard.size || '4x6',
    mail_type: 'first_class'
  };

  const authHeader = 'Basic ' + Buffer.from(LOB_API_KEY + ':').toString('base64');

  const response = await fetch('https://api.lob.com/v1/postcards', {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lobBody)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Lob error: ${data.error?.message || response.status}`);
  }
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!LOB_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'LOB_API_KEY missing' }) };
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'STRIPE_SECRET_KEY missing' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { paymentIntentId, postcards } = body;

    if (!paymentIntentId) {
      return { statusCode: 402, body: JSON.stringify({ error: 'paymentIntentId required' }) };
    }
    if (!Array.isArray(postcards) || postcards.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'postcards[] required and non-empty' }) };
    }
    for (let i = 0; i < postcards.length; i++) {
      if (!validateRecipient(postcards[i].to)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Postcard ${i + 1}: invalid recipient fields` })
        };
      }
      if (!postcards[i].front) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Postcard ${i + 1}: missing front image` })
        };
      }
    }

    const stripe = Stripe(stripeSecret);
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== 'succeeded') {
      return {
        statusCode: 402,
        body: JSON.stringify({ error: `Payment not succeeded (status: ${pi.status})` })
      };
    }

    if (pi.metadata?.fulfilled === 'true') {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Payment already fulfilled' })
      };
    }

    const paidQuantity = parseInt(pi.metadata?.quantity || '0', 10);
    if (postcards.length !== paidQuantity) {
      return {
        statusCode: 402,
        body: JSON.stringify({
          error: `Postcard count (${postcards.length}) doesn't match paid quantity (${paidQuantity})`
        })
      };
    }

    const expectedAmount = paidQuantity * PRICE_PER_POSTCARD_CENTS;
    if (pi.amount !== expectedAmount) {
      return {
        statusCode: 402,
        body: JSON.stringify({
          error: `Amount mismatch: charged ${pi.amount}, expected ${expectedAmount}`
        })
      };
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { ...pi.metadata, fulfilled: 'in_progress' }
    });

    const results = [];
    const errors = [];
    for (let i = 0; i < postcards.length; i++) {
      try {
        const lobResult = await createOnePostcardInLob(postcards[i]);
        results.push({ index: i, id: lobResult.id, ok: true });
      } catch (err) {
        console.error(`Lob error on postcard ${i}:`, err);
        errors.push({ index: i, error: err.message });
        results.push({ index: i, ok: false, error: err.message });
      }
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...pi.metadata,
        fulfilled: errors.length === 0 ? 'true' : 'partial',
        success_count: String(results.filter(r => r.ok).length),
        error_count: String(errors.length)
      }
    });

    return {
      statusCode: errors.length === postcards.length ? 500 : 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: errors.length === 0,
        results,
        ids: results.filter(r => r.ok).map(r => r.id),
        errors
      })
    };
  } catch (err) {
    console.error('create-postcards error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
