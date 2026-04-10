import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { seedDatabase } from './config/seed.js';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Routes
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// Seed & Start
seedDatabase();

app.listen(config.port, () => {
  console.log(`🍕 Servidor corriendo en http://localhost:${config.port}`);
  console.log(`   Base de datos: SQLite (archivo local)`);
});
