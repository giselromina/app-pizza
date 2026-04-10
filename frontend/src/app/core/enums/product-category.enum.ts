export enum ProductCategory {
  PIZZA = 'PIZZA',
  DRINK = 'DRINK',
  DESSERT = 'DESSERT',
  EXTRA = 'EXTRA',
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.PIZZA]: '🍕 Pizzas',
  [ProductCategory.DRINK]: '🥤 Bebidas',
  [ProductCategory.DESSERT]: '🍰 Postres',
  [ProductCategory.EXTRA]: '➕ Extras',
};
