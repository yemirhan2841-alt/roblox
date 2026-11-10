const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'roblox-platform-secret-change-me';

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Giriş yapmalısınız' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Geçersiz token formatı' });
  }

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token geçersiz veya süresi dolmuş' });
  }
}

module.exports = { authenticate, JWT_SECRET };