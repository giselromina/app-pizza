import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middlewares/auth.middleware.js';
import { productController } from '../controllers/product.controller.js';
import { settingsController } from '../controllers/settings.controller.js';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminOnly);

// Admin: who am I
router.get('/me', (req, res) => authController.me(req, res));

// Admin: products CRUD
router.get('/products', (req, res, next) => productController.getAll(req, res, next));
router.get('/products/:id', (req, res, next) => productController.getById(req, res, next));
router.post('/products', (req, res, next) => productController.create(req, res, next));
router.put('/products/:id', (req, res, next) => productController.update(req, res, next));
router.delete('/products/:id', (req, res, next) => productController.delete(req, res, next));

// Admin: settings
router.get('/settings', (req, res, next) => settingsController.getAll(req, res, next));
router.put('/settings', (req, res, next) => settingsController.update(req, res, next));

// Admin: categories
router.get('/categories', (req, res, next) => productController.getCategories(req, res, next));
router.post('/categories', (req, res, next) => productController.createCategory(req, res, next));
router.delete('/categories/:name', (req, res, next) => productController.deleteCategory(req, res, next));

export default router;
