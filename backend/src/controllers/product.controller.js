import { productService } from '../services/product.service.js';

export class ProductController {
  /** GET /api/menu - Public: grouped by category */
  getMenu(req, res, next) {
    try {
      const menu = productService.getMenuForCustomers();
      res.json(menu);
    } catch (err) { next(err); }
  }

  /** GET /api/admin/products - Admin: all products */
  getAll(req, res, next) {
    try {
      const products = productService.getAllForAdmin();
      res.json(products);
    } catch (err) { next(err); }
  }

  /** GET /api/admin/products/:id */
  getById(req, res, next) {
    try {
      const product = productService.getById(Number(req.params.id));
      if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
      res.json(product);
    } catch (err) { next(err); }
  }

  /** POST /api/admin/products */
  create(req, res, next) {
    try {
      const product = productService.create(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  }

  /** PUT /api/admin/products/:id */
  update(req, res, next) {
    try {
      const product = productService.update(Number(req.params.id), req.body);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
      res.json(product);
    } catch (err) { next(err); }
  }

  /** DELETE /api/admin/products/:id */
  delete(req, res, next) {
    try {
      const deleted = productService.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Producto no encontrado.' });
      res.json({ message: 'Producto eliminado.' });
    } catch (err) { next(err); }
  }

  /** POST /api/order - Public: register a sale (decrement stock, increment sales) */
  recordOrder(req, res, next) {
    try {
      const { items } = req.body;
      productService.recordSale(items);
      res.json({ message: 'Venta registrada.' });
    } catch (err) { next(err); }
  }

  /** GET /api/admin/categories */
  getCategories(req, res, next) {
    try {
      res.json(productService.getCategories());
    } catch (err) { next(err); }
  }

  /** POST /api/admin/categories */
  createCategory(req, res, next) {
    try {
      const { name } = req.body;
      productService.createCategory(name);
      res.status(201).json({ name: name.trim().toUpperCase() });
    } catch (err) { next(err); }
  }

  /** DELETE /api/admin/categories/:name */
  deleteCategory(req, res, next) {
    try {
      const result = productService.deleteCategory(req.params.name);
      if (!result.ok) return res.status(400).json({ message: result.reason });
      res.json({ message: 'Categoría eliminada.' });
    } catch (err) { next(err); }
  }
}

export const productController = new ProductController();
