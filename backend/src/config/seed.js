import db from './database.js';
import bcrypt from 'bcryptjs';
import { config } from './env.js';
import { ProductCategory } from '../enums/index.js';

export function seedDatabase() {
  // Seed admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get(config.adminDefaultUser);
  if (!adminExists) {
    const hash = bcrypt.hashSync(config.adminDefaultPass, 10);
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
      config.adminDefaultUser,
      hash,
      'ADMIN'
    );
    console.log(`Admin user "${config.adminDefaultUser}" created.`);
  }

  // Seed default settings
  const upsertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const settingsExist = db.prepare('SELECT key FROM settings WHERE key = ?').get('whatsapp_number');
  if (!settingsExist) {
    const seedSettings = db.transaction(() => {
      upsertSetting.run('whatsapp_number', config.whatsappNumber);
      upsertSetting.run('restaurant_name', config.restaurantName);
      upsertSetting.run('restaurant_address', 'Av. Italia 1234, Buenos Aires');
      upsertSetting.run('restaurant_hours', 'Lun a Dom: 11:00 - 23:00');
      upsertSetting.run('welcome_message', '¡Bienvenidos a La Pizza Italiana!');
    });
    seedSettings();
    console.log('Default settings seeded.');
  }

  // Seed products if table is empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO products (name, description, price, category, available, sort_order)
      VALUES (?, ?, ?, ?, 1, ?)
    `);

    const seedProducts = db.transaction(() => {
      // Pizzas
      insert.run('Muzzarella', 'Salsa de tomate, mozzarella y orégano.', 1200, ProductCategory.PIZZA, 1);
      insert.run('Napolitana', 'Salsa de tomate, mozzarella, tomate fresco y ajo.', 1400, ProductCategory.PIZZA, 2);
      insert.run('Fugazzeta', 'Mozzarella con abundante cebolla.', 1350, ProductCategory.PIZZA, 3);
      insert.run('4 Quesos', 'Mozzarella, roquefort, parmesano y fontina.', 1700, ProductCategory.PIZZA, 4);
      insert.run('Calabresa', 'Salsa de tomate, mozzarella y longaniza calabresa.', 1500, ProductCategory.PIZZA, 5);
      insert.run('Especial', 'Jamón, morrón, aceitunas, huevo y mozzarella.', 1600, ProductCategory.PIZZA, 6);
      insert.run('Rúcula y Parmesano', 'Mozzarella, rúcula fresca y parmesano.', 1550, ProductCategory.PIZZA, 7);
      insert.run('Provolone', 'Salsa de tomate, provolone y orégano.', 1450, ProductCategory.PIZZA, 8);

      // Drinks
      insert.run('Coca-Cola 1.5L', 'Coca-Cola línea 1.5 litros.', 500, ProductCategory.DRINK, 20);
      insert.run('Agua mineral 500ml', 'Agua mineral sin gas.', 250, ProductCategory.DRINK, 21);
      insert.run('Cerveza artesanal', 'Pinta de cerveza artesanal del día.', 600, ProductCategory.DRINK, 22);
      insert.run('Fanta 1.5L', 'Fanta naranja 1.5 litros.', 500, ProductCategory.DRINK, 23);

      // Desserts
      insert.run('Tiramisú', 'Tiramisú casero tradicional italiano.', 800, ProductCategory.DESSERT, 30);
      insert.run('Flan casero', 'Flan casero con dulce de leche y crema.', 600, ProductCategory.DESSERT, 31);
    });

    seedProducts();
    console.log('Default products seeded.');
  }
}
