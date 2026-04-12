import { ProductCategory } from '../enums';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  available: number; // 1 or 0 from SQLite
  sort_order: number;
  stock: number;   // -1 = unlimited
  sales: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppSettings {
  whatsappNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantHours: string;
  welcomeMessage: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export type MenuResponse = Record<string, Product[]>;
