import db from '../config/database.js';
import bcrypt from 'bcryptjs';

export class UserRepository {
  getByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }

  getById(id) {
    return db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(id);
  }

  create({ username, password, role }) {
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, hash, role);
    return this.getById(result.lastInsertRowid);
  }

  verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

export const userRepository = new UserRepository();
