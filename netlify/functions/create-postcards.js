const { MercadoPagoConfig, Payment } = require('mercadopago');

const PRICE_PER_POSTCARD_COP = 12200;
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
  const mpAccessToken = process.env.MP_ACCESS_TOKEN;
  if (!mpAccessToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'MP_ACCESS_TOKEN missing' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { paymentId, postcards } = body;

    if (!paymentId) {
      return { statusCode: 402, body: JSON.stringify({ error: 'paymentId required' }) };
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

    const mpClient = new MercadoPagoConfig({
      accessToken: mpAccessToken,
      options: { timeout: 5000 }
    });
    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== 'approved') {
      return {
        statusCode: 402,
        body: JSON.stringify({ error: `Payment not approved (status: ${payment.status})` })
      };
    }

    const expectedAmount = postcards.length * PRICE_PER_POSTCARD_COP;
    if (Math.round(payment.transaction_amount) !== expectedAmount) {
      return {
        statusCode: 402,
        body: JSON.stringify({
          error: `Amount mismatch: charged ${payment.transaction_amount} COP, expected ${expectedAmount} COP`
        })
      };
    }

    const paidQuantity = parseInt(payment.metadata?.quantity || '0', 10);
    if (paidQuantity && postcards.length !== paidQuantity) {
      return {
        statusCode: 402,
        body: JSON.stringify({
          error: `Postcard count (${postcards.length}) doesn't match paid quantity (${paidQuantity})`
        })
      };
    }

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

    return {
      statusCode: errors.length === postcards.length ? 500 : 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: errors.length === 0,
        results,
        ids: results.filter(r => r.ok).map(r => r.id),
        errors,
        paymentStatus: payment.status,
        paymentAmount: payment.transaction_amount
      })
    };
  } catch (err) {
    console.error('create-postcards error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
