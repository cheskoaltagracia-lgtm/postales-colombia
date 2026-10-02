const { MercadoPagoConfig, Payment } = require('mercadopago');

const PRICE_PER_POSTCARD_COP = 18000;
const MAX_POSTCARDS = 50;
const MAX_MESSAGE_CHARS = 1500;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
// Un pago solo sirve para crear sus postales dentro de esta ventana. Coincide con las
// 24 h que Lob respeta la Idempotency-Key, asi un mismo pago NUNCA imprime dos veces.
const PAYMENT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LOB_API_KEY = process.env.LOB_API_KEY;

// Lob exige que la direccion de RETORNO (from) sea de EE.UU.
// Direccion de retorno de Postales Colombia en EE.UU. (Bethesda, MD).
const RETURN_ADDRESS = {
  address_line1: '6903 Rockledge Dr Ste 800',
  address_city: 'Bethesda',
  address_state: 'MD',
  address_zip: '20817',
  address_country: 'US'
};

function validateAddress(addr) {
  return !!(addr && addr.name && addr.address_line1 && addr.address_city && addr.address_zip && addr.address_country);
}

const validateRecipient = validateAddress;
const validateSender = validateAddress;

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '<br>');
}

async function createOnePostcardInLob(postcard, idempotencyKey) {
  const authHeader = 'Basic ' + Buffer.from(LOB_API_KEY + ':').toString('base64');

  const form = new FormData();
  form.append('description', postcard.description || 'Postales Colombia');
  form.append('size', postcard.size || '4x6');
  form.append('mail_type', 'usps_first_class');
  form.append('use_type', 'operational'); // correspondencia personal del cliente (no es marketing)

  // Direcciones en notacion bracket para multipart (to[name], from[name], etc.)
  const appendAddress = (key, addr) => {
    if (!addr) return;
    ['name', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_country'].forEach(field => {
      const val = addr[field];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        form.append(`${key}[${field}]`, String(val).trim());
      }
    });
  };
  appendAddress('to', postcard.to);
  // El remitente que ve el destinatario conserva el nombre, pero la direccion de retorno es US (requisito de Lob)
  appendAddress('from', Object.assign(
    { name: (postcard.from && postcard.from.name) || 'Postales Colombia' },
    RETURN_ADDRESS
  ));

  // FRENTE: la foto va como ARCHIVO de imagen, NO como texto base64 (eso causaba el error 422)
  const frontDataUrl = postcard.front || '';
  const commaIdx = frontDataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? frontDataUrl.slice(commaIdx + 1) : frontDataUrl;
  const mimeMatch = frontDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64/);
  const mime = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';
  const ext = mime === 'image/png' ? 'png' : 'jpg';
  const buffer = Buffer.from(base64, 'base64');
  form.append('front', new Blob([buffer], { type: mime }), `front.${ext}`);

  // REVERSO: HTML corto con el mensaje del cliente (Lob reserva solo el area de la direccion a la derecha)
  const msg = escapeHtml(postcard.message) || '¡Saludos desde Colombia!';
  const backHtml = `<html><head><meta charset="utf-8"><style>` +
    `html,body{margin:0;padding:0;width:6.25in;height:4.25in;}` +
    `.msg{box-sizing:border-box;width:3.4in;padding:0.45in 0.4in;font-family:Georgia,'Times New Roman',serif;font-size:14pt;color:#1a1a1a;line-height:1.5;}` +
    `</style></head><body><div class="msg">${msg}</div></body></html>`;
  form.append('back', backHtml);

  const response = await fetch('https://api.lob.com/v1/postcards', {
    method: 'POST',
    // sin Content-Type: FormData pone el boundary correcto.
    // Idempotency-Key: si alguien reenvia el mismo pago, Lob devuelve la postal ya creada en vez de imprimir otra.
    headers: { 'Authorization': authHeader, 'Idempotency-Key': idempotencyKey },
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data && data.error ? (data.error.message || JSON.stringify(data.error)) : ('HTTP ' + response.status);
    throw new Error(`Lob error: ${msg}`);
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
    if (!/^\d{1,20}$/.test(String(paymentId))) {
      return res.status(400).json({ error: 'Invalid paymentId' });
    }
    if (!Array.isArray(postcards) || postcards.length === 0 || postcards.length > MAX_POSTCARDS) {
      return res.status(400).json({ error: `postcards[] required (1-${MAX_POSTCARDS})` });
    }
    for (let i = 0; i < postcards.length; i++) {
      if (!validateRecipient(postcards[i].to)) {
        return res.status(400).json({
          error: `Postcard ${i + 1}: invalid recipient fields`
        });
      }
      // El remitente ya no se valida: la direccion de retorno es fija (US) y solo usamos el nombre (opcional).
      const front = postcards[i].front;
      if (typeof front !== 'string' || !/^data:image\/(jpeg|jpg|png);base64,/i.test(front)) {
        return res.status(400).json({
          error: `Postcard ${i + 1}: missing or invalid front image (JPG/PNG)`
        });
      }
      if (front.length * 0.75 > MAX_IMAGE_BYTES) {
        return res.status(400).json({ error: `Postcard ${i + 1}: image too large` });
      }
      if (postcards[i].message && String(postcards[i].message).length > MAX_MESSAGE_CHARS) {
        return res.status(400).json({ error: `Postcard ${i + 1}: message too long` });
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

    // El pago tiene que ser de una preferencia de Postales (no cualquier pago aprobado de la cuenta)
    if (!String(payment.external_reference || '').startsWith('postales_')) {
      return res.status(402).json({ error: 'Payment does not belong to Postales Colombia' });
    }
    if (payment.currency_id && payment.currency_id !== 'COP') {
      return res.status(402).json({ error: 'Invalid payment currency' });
    }
    // Pago viejo = no se puede reutilizar (cierra el reenvio del mismo pago para imprimir gratis)
    const approvedAt = Date.parse(payment.date_approved || payment.date_created || '');
    if (!approvedAt || Date.now() - approvedAt > PAYMENT_MAX_AGE_MS) {
      return res.status(402).json({
        error: 'Este pago ya no es valido para crear postales (mas de 24 h). Escribenos si necesitas ayuda.'
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
        const lobResult = await createOnePostcardInLob(postcards[i], `postales-${payment.id}-${i}`);
        results.push({
          index: i,
          ok: true,
          id: lobResult.id,
          url: lobResult.url,                                 // PDF de como quedo impresa
          expectedDeliveryDate: lobResult.expected_delivery_date,
          carrier: lobResult.carrier
        });
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
