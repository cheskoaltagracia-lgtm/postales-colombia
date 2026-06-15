const { MercadoPagoConfig, Preference } = require('mercadopago');

const PRICE_PER_POSTCARD_COP = 12200;
const MAX_QUANTITY = 50;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MP_ACCESS_TOKEN missing in Netlify env vars' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const quantity = parseInt(body.quantity, 10);
    const siteOrigin = body.siteOrigin || 'https://postales-colombian.netlify.app';

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Quantity must be an integer between 1 and ${MAX_QUANTITY}` })
      };
    }

    const client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 }
    });
    const preferenceClient = new Preference(client);

    const externalReference = `postales_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const unitPrice = PRICE_PER_POSTCARD_COP;

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: 'postal-4x6',
            title: 'Postal Colombia 4x6 (impresión + envío internacional)',
            description: `${quantity} postal(es) a enviar fisicamente`,
            quantity: quantity,
            currency_id: 'COP',
            unit_price: unitPrice
          }
        ],
        back_urls: {
          success: `${siteOrigin}/?mp_status=approved`,
          failure: `${siteOrigin}/?mp_status=rejected`,
          pending: `${siteOrigin}/?mp_status=pending`
        },
        auto_return: 'approved',
        external_reference: externalReference,
        statement_descriptor: 'POSTALES COLOMBIA',
        metadata: {
          quantity: String(quantity),
          product: 'Postales Colombia'
        }
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
        externalReference,
        quantity,
        totalCOP: quantity * unitPrice
      })
    };
  } catch (err) {
    console.error('create-preference error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error creating preference' })
    };
  }
};
