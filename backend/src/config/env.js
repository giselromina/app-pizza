import 'dotenv/config';

export const config = Object.freeze({
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  adminDefaultUser: process.env.ADMIN_DEFAULT_USER || 'admin',
  adminDefaultPass: process.env.ADMIN_DEFAULT_PASS || 'admin123',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '5491112345678',
  restaurantName: process.env.RESTAURANT_NAME || 'La Pizza Italiana',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
});
