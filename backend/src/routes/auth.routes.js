import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;
