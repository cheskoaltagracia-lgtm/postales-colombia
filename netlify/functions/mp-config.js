exports.handler = async () => {
  const key = process.env.MP_PUBLIC_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MP_PUBLIC_KEY missing in Netlify env vars' })
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: key })
  };
};
