import db from '../config/database.js';

export class SettingsRepository {
  getAll() {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }

  get(key) {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row?.value ?? null;
  }

  set(key, value) {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  }

  setMultiple(entries) {
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((items) => {
      for (const [key, value] of Object.entries(items)) {
        upsert.run(key, String(value));
      }
    });
    transaction(entries);
  }
}

export const settingsRepository = new SettingsRepository();
