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

  create({ name, description, price, category, image, available, sort_order, stock }) {
    const result = db.prepare(`
      INSERT INTO products (name, description, price, category, image, available, sort_order, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description || '', price, category, image || '', available ?? 1, sort_order ?? 0, stock ?? -1);
    return this.getById(result.lastInsertRowid);
  }

  update(id, fields) {
    const current = this.getById(id);
    if (!current) return null;

    const merged = { ...current, ...fields, updated_at: new Date().toISOString() };
    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image = ?,
          available = ?, sort_order = ?, stock = ?, sales = ?, updated_at = ?
      WHERE id = ?
    `).run(
      merged.name, merged.description, merged.price, merged.category,
      merged.image, merged.available, merged.sort_order,
      merged.stock ?? -1, merged.sales ?? 0, merged.updated_at, id
    );
    return this.getById(id);
  }

  recordSale(items) {
    const stmt = db.prepare(`
      UPDATE products
      SET sales = sales + ?,
          stock = CASE WHEN stock = -1 THEN -1 ELSE MAX(0, stock - ?) END,
          updated_at = datetime('now')
      WHERE id = ?
    `);
    const run = db.transaction((list) => {
      for (const { id, quantity } of list) {
        stmt.run(quantity, quantity, id);
      }
    });
    run(items);
  }

  delete(id) {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const productRepository = new ProductRepository();
