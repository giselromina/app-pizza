import db from '../config/database.js';

export class ProductRepository {
  getAll() {
    return db.prepare('SELECT * FROM products ORDER BY sort_order ASC').all();
  }

  getAvailable() {
    return db.prepare('SELECT * FROM products WHERE available = 1 ORDER BY sort_order ASC').all();
  }

  getById(id) {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  }

  getByCategory(category) {
    return db.prepare('SELECT * FROM products WHERE category = ? AND available = 1 ORDER BY sort_order ASC').all(category);
  }

  create({ name, description, price, category, image, available, sort_order }) {
    const result = db.prepare(`
      INSERT INTO products (name, description, price, category, image, available, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description || '', price, category, image || '', available ?? 1, sort_order ?? 0);
    return this.getById(result.lastInsertRowid);
  }

  update(id, fields) {
    const current = this.getById(id);
    if (!current) return null;

    const merged = { ...current, ...fields, updated_at: new Date().toISOString() };
    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image = ?,
          available = ?, sort_order = ?, updated_at = ?
      WHERE id = ?
    `).run(
      merged.name, merged.description, merged.price, merged.category,
      merged.image, merged.available, merged.sort_order, merged.updated_at, id
    );
    return this.getById(id);
  }

  delete(id) {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const productRepository = new ProductRepository();
