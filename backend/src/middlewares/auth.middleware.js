import { authService, AuthError } from '../services/auth.service.js';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido.' });
  }

  try {
    const token = header.slice(7);
    req.user = authService.verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }
  next();
}
