exports.handler = async () => {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'STRIPE_PUBLISHABLE_KEY missing in Netlify env vars' })
    };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publishableKey: key })
  };
};
