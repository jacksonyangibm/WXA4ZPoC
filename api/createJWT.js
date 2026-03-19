const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Use environment variable on Vercel, fallback to file for local dev
let privateKey;
if (process.env.PRIVATE_KEY) {
  privateKey = process.env.PRIVATE_KEY;
} else {
  privateKey = fs.readFileSync(path.join(__dirname, '..', 'private.pem'), 'utf8');
}

function getSessionUser(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], 'base64').toString('utf8');
    return decoded.split(':')[0];
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = jwt.sign(
    { sub: user },
    privateKey,
    { algorithm: 'RS256', expiresIn: '1h' }
  );

  res.setHeader('Content-Type', 'text/plain');
  res.send(token);
};
