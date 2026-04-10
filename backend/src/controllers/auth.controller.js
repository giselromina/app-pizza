import { authService } from '../services/auth.service.js';

export class AuthController {
  login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = authService.login(username, password);
      res.json(result);
    } catch (err) { next(err); }
  }

  me(req, res) {
    res.json(req.user);
  }
}

export const authController = new AuthController();
