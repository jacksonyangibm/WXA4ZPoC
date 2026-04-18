const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzooAFTYrkE484bIJA32dgajB6i3XOE8U-bdWV-g7eKOmrjrOAt-ZI_U4lXz_aGG_XUew/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { original, translated, response } = req.body || {};

  let user = 'unknown';
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);
  if (match) {
    try {
      user = Buffer.from(match[1], 'base64').toString('utf8').split(':')[0];
    } catch (e) {}
  }

  const payload = JSON.stringify({ user, original, translated, response });

  try {
    // First request - get redirect URL
    const r1 = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      redirect: 'manual',
    });

    // Follow redirect with POST
    if (r1.status >= 300 && r1.status < 400) {
      const redirectUrl = r1.headers.get('location');
      if (redirectUrl) {
        await fetch(redirectUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log' });
  }
};
