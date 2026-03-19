module.exports = async (req, res) => {
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; Max-Age=0');
  res.redirect(303, '/login.html');
};
