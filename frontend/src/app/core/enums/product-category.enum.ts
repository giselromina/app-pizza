export enum ProductCategory {
  PIZZA = 'PIZZA',
  SANDWICH = 'SANDWICH',
  DRINK = 'DRINK',
  DESSERT = 'DESSERT',
  EXTRA = 'EXTRA',
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.PIZZA]: '🍕 Pizzas',
  [ProductCategory.SANDWICH]: '🥪 Sandwiches',
  [ProductCategory.DRINK]: '🥤 Bebidas',
  [ProductCategory.DESSERT]: '🍰 Postres',
  [ProductCategory.EXTRA]: '➕ Extras',
};
