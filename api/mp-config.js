module.exports = async (req, res) => {
  const key = process.env.MP_PUBLIC_KEY;
  if (!key) {
    return res.status(500).json({ error: 'MP_PUBLIC_KEY missing in Vercel env vars' });
  }
  return res.status(200).json({ publicKey: key });
};
