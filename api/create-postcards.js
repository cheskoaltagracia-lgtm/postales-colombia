const { MercadoPagoConfig, Payment } = require('mercadopago');

const PRICE_PER_POSTCARD_COP = 12200;
const LOB_API_KEY = process.env.LOB_API_KEY;

function validateAddress(addr) {
  return !!(addr && addr.name && addr.address_line1 && addr.address_city && addr.address_zip && addr.address_country);
}

const validateRecipient = validateAddress;
const validateSender = validateAddress;

async function createOnePostcardInLob(postcard) {
  const lobBody = {
    description: postcard.description || 'Postales Colombia',
    to: postcard.to,
    from: postcard.from,
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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!LOB_API_KEY) {
    return res.status(500).json({ error: 'LOB_API_KEY missing' });
  }
  const mpAccessToken = process.env.MP_ACCESS_TOKEN;
  if (!mpAccessToken) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN missing' });
  }

  try {
    const body = req.body || {};
    const { paymentId, postcards } = body;

    if (!paymentId) {
      return res.status(402).json({ error: 'paymentId required' });
    }
    if (!Array.isArray(postcards) || postcards.length === 0) {
      return res.status(400).json({ error: 'postcards[] required and non-empty' });
    }
    for (let i = 0; i < postcards.length; i++) {
      if (!validateRecipient(postcards[i].to)) {
        return res.status(400).json({
          error: `Postcard ${i + 1}: invalid recipient fields`
        });
      }
      if (!validateSender(postcards[i].from)) {
        return res.status(400).json({
          error: `Postcard ${i + 1}: invalid sender fields`
        });
      }
      if (!postcards[i].front) {
        return res.status(400).json({
          error: `Postcard ${i + 1}: missing front image`
        });
      }
    }

    const mpClient = new MercadoPagoConfig({
      accessToken: mpAccessToken,
      options: { timeout: 5000 }
    });
    const paymentClient = new Payment(mpClient);
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== 'approved') {
      return res.status(402).json({
        error: `Payment not approved (status: ${payment.status})`
      });
    }

    const expectedAmount = postcards.length * PRICE_PER_POSTCARD_COP;
    if (Math.round(payment.transaction_amount) !== expectedAmount) {
      return res.status(402).json({
        error: `Amount mismatch: charged ${payment.transaction_amount} COP, expected ${expectedAmount} COP`
      });
    }

    const paidQuantity = parseInt(payment.metadata?.quantity || '0', 10);
    if (paidQuantity && postcards.length !== paidQuantity) {
      return res.status(402).json({
        error: `Postcard count (${postcards.length}) doesn't match paid quantity (${paidQuantity})`
      });
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

    return res.status(errors.length === postcards.length ? 500 : 200).json({
      ok: errors.length === 0,
      results,
      ids: results.filter(r => r.ok).map(r => r.id),
      errors,
      paymentStatus: payment.status,
      paymentAmount: payment.transaction_amount
    });
  } catch (err) {
    console.error('create-postcards error:', err);
    return res.status(500).json({ error: err.message });
  }
};
