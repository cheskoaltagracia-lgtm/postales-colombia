const LOB_API_KEY = process.env.LOB_API_KEY;

exports.handler = async (event, context) => {
  console.log('Function invoked', { method: event.httpMethod, hasKey: !!LOB_API_KEY });
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!LOB_API_KEY) {
    console.error('LOB_API_KEY not configured in Netlify env vars');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: LOB_API_KEY missing' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { to, from, front, message, size, description } = body;

    // Validate required fields
    if (!to?.name || !to?.address_line1 || !to?.address_city || !to?.address_zip || !to?.address_country) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required recipient fields' }) };
    }
    if (!front) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing front image' }) };
    }

    const lobBody = {
      description: description || 'Postales Colombia',
      to,
      from: from || {
        name: 'Postales Colombia',
        address_line1: 'Calle 85 #11-35',
        address_city: 'Bogota',
        address_state: 'Cundinamarca',
        address_zip: '110111',
        address_country: 'CO'
      },
      front,
      message: message || '',
      size: size || '4x6',
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
      console.error('Lob API error:', data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};