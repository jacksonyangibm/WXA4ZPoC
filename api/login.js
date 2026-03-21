const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxqmUHHvAmYxYUFmR-jR911NhPRarmVOwLNwG4trX8N7TowaeiPonRuycnJN0Gycn6cfw/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  try {
    const resp = await fetch(SHEET_URL);
    const users = await resp.json();

    if (users[username] && users[username] === password) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      res.setHeader('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`);
      res.redirect(303, '/');
    } else {
      res.redirect(303, '/login.html?error=1');
    }
  } catch (err) {
    res.redirect(303, '/login.html?error=1');
  }
};
