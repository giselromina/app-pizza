export const ProductCategory = Object.freeze({
  PIZZA: 'PIZZA',
  DRINK: 'DRINK',
  DESSERT: 'DESSERT',
  EXTRA: 'EXTRA',
});

export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
});

export const OrderStatus = Object.freeze({
  SENT_ONLY: 'SENT_ONLY',
});

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);
export const USER_ROLES = Object.values(UserRole);
