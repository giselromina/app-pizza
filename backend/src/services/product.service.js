import { productRepository } from '../repositories/product.repository.js';
import { PRODUCT_CATEGORIES } from '../enums/index.js';

export class ProductService {
  getMenuForCustomers() {
    const products = productRepository.getAvailable();
    return this.#groupByCategory(products);
  }

  getAllForAdmin() {
    return productRepository.getAll();
  }

  getById(id) {
    return productRepository.getById(id);
  }

  create(data) {
    this.#validate(data);
    return productRepository.create(data);
  }

  update(id, data) {
    const existing = productRepository.getById(id);
    if (!existing) return null;
    if (data.category) this.#validateCategory(data.category);
    if (data.price !== undefined && data.price < 0) throw new ValidationError('El precio no puede ser negativo.');
    return productRepository.update(id, data);
  }

  delete(id) {
    return productRepository.delete(id);
  }

  #groupByCategory(products) {
    const grouped = {};
    for (const p of products) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }
    return grouped;
  }

  #validate(data) {
    if (!data.name?.trim()) throw new ValidationError('El nombre es obligatorio.');
    if (data.price == null || data.price < 0) throw new ValidationError('El precio es obligatorio y debe ser >= 0.');
    this.#validateCategory(data.category);
  }

  #validateCategory(category) {
    if (!PRODUCT_CATEGORIES.includes(category)) {
      throw new ValidationError(`Categoría inválida. Opciones: ${PRODUCT_CATEGORIES.join(', ')}`);
    }
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export const productService = new ProductService();
