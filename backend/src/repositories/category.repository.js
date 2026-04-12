import db from '../config/database.js';

export class CategoryRepository {
  getAll() {
    return db.prepare('SELECT name FROM categories ORDER BY name').all().map(r => r.name);
  }

  /** Returns categories from the table plus all distinct categories used in products */
  getMerged() {
    const fromTable = this.getAll();
    const fromProducts = db
      .prepare('SELECT DISTINCT category FROM products ORDER BY category')
      .all()
      .map(r => r.category);
    return [...new Set([...fromTable, ...fromProducts])].sort();
  }

  create(name) {
    try {
      db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim().toUpperCase());
      return true;
    } catch (_) {
      return false; // already exists
    }
  }

  delete(name) {
    const hasProducts = db
      .prepare('SELECT COUNT(*) as count FROM products WHERE category = ?')
      .get(name);
    if (hasProducts?.count > 0) return { ok: false, reason: 'La categoría tiene productos asignados.' };
    const result = db.prepare('DELETE FROM categories WHERE name = ?').run(name);
    return { ok: result.changes > 0 };
  }
}

export const categoryRepository = new CategoryRepository();
