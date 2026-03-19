const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load RSA private key for JWT signing
const privateKey = fs.readFileSync(path.join(__dirname, 'private.pem'), 'utf8');

// PoC demo accounts (production should use a real user store)
const USERS = {
  demo: 'demo123',
  admin: 'admin123'
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'wxa4z-poc-secret-' + Date.now(),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Serve login page for unauthenticated users
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'login.html'));
  }
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.redirect('/?error=1');
  }
});

// Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Generate JWT for authenticated users
app.get('/createJWT', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = jwt.sign(
    { sub: req.session.user },
    privateKey,
    { algorithm: 'RS256', expiresIn: '1h' }
  );

  res.type('text/plain').send(token);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Demo accounts: demo/demo123, admin/admin123');
});
