const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwqMVU_Cqw9c0pVccph_wfGD7rJYmX-K4brJGDKnusQZvSJnFV3gM4WlqUL2IYJK8doFw/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};

  // Get actual username from session cookie
  let user = 'unknown';
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);
  if (match) {
    try {
      user = Buffer.from(match[1], 'base64').toString('utf8').split(':')[0];
    } catch (e) {}
  }

  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message }),
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log' });
  }
};
