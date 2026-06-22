// Verifica si un PDF de Lob ya esta disponible en el CDN (lob-assets.com).
// El frontend lo consulta antes de abrir el link, porque Lob genera el PDF
// asincronicamente y los primeros segundos despues de crear la postal devuelve 404.

module.exports = async (req, res) => {
  const url = (req.query && req.query.url) || (req.body && req.body.url) || '';

  // Solo permitir URLs de Lob assets (evita usar este endpoint como proxy general)
  if (!url || !/^https:\/\/lob-assets\.com\/postcards\//.test(url)) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  try {
    const r = await fetch(url, { method: 'HEAD' });
    return res.status(200).json({
      ready: r.ok,
      status: r.status
    });
  } catch (err) {
    console.error('check-pdf error:', err);
    return res.status(500).json({ error: err.message, ready: false });
  }
};
