import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { config } from '../config/env.js';
import { ValidationError } from './product.service.js';

export class AuthService {
  login(username, password) {
    if (!username || !password) throw new ValidationError('Usuario y contraseña son obligatorios.');

    const user = userRepository.getByUsername(username);
    if (!user) throw new AuthError('Credenciales inválidas.');

    const valid = userRepository.verifyPassword(password, user.password);
    if (!valid) throw new AuthError('Credenciales inválidas.');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

export const authService = new AuthService();
