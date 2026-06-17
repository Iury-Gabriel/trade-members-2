const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};

module.exports = adminMiddleware;
