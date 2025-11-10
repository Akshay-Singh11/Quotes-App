const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authorization token missing' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminOnly };

