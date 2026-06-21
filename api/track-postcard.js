// Rastreo de postal: el cliente manda el ID (psc_...) y le devolvemos el estado real de Lob.
// La llave secreta de Lob queda SIEMPRE en el servidor (blindada); el navegador nunca la ve.

const LOB_API_KEY = process.env.LOB_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  if (!LOB_API_KEY) {
    return res.status(500).json({ error: 'LOB_API_KEY missing' });
  }

  const rawId = (req.query && req.query.id) || (req.body && req.body.id) || '';
  const id = String(rawId).trim();

  // Validar formato para evitar abusos (solo IDs de postal de Lob)
  if (!/^psc_[a-zA-Z0-9]+$/.test(id)) {
    return res.status(400).json({ error: 'Número de postal inválido. Debe empezar con "psc_".' });
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(LOB_API_KEY + ':').toString('base64');
    const resp = await fetch(`https://api.lob.com/v1/postcards/${id}`, {
      headers: { 'Authorization': authHeader }
    });
    const data = await resp.json();

    if (!resp.ok) {
      const msg = data && data.error ? (data.error.message || JSON.stringify(data.error)) : ('HTTP ' + resp.status);
      return res.status(resp.status).json({ error: msg });
    }

    const events = (data.tracking_events || []).map(e => ({
      name: e.name,
      type: e.type,
      time: e.time || e.date_created || null
    }));

    return res.status(200).json({
      id: data.id,
      expectedDeliveryDate: data.expected_delivery_date || null,
      dateCreated: data.date_created || null,
      url: data.url || null,
      carrier: data.carrier || null,
      trackingEvents: events
    });
  } catch (err) {
    console.error('track-postcard error:', err);
    return res.status(500).json({ error: err.message });
  }
};
