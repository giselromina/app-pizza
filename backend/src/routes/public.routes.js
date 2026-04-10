import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { settingsController } from '../controllers/settings.controller.js';

const router = Router();

// Public menu (grouped by category)
router.get('/menu', (req, res, next) => productController.getMenu(req, res, next));

// Public settings
router.get('/settings', (req, res, next) => settingsController.getPublic(req, res, next));

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
