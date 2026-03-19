import type { Product } from "@/types";

const VIEW_STORAGE_KEY = 'product_view_counts';

export type ProductViewCounts = Record<string, number>;

export function getProductViewCounts(): ProductViewCounts {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function trackProductView(productId: string) {
  if (typeof window === 'undefined') return;
  const counts = getProductViewCounts();
  counts[productId] = (counts[productId] || 0) + 1;
  window.localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(counts));
}

export function getRecommendedProducts(products: Product[], limit = 8): Product[] {
  const counts = getProductViewCounts();
  const viewedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (viewedEntries.length === 0) {
    return [...products]
      .filter((product) => product.is_active)
      .sort((a, b) => (b.rating * 20 + b.sold_count) - (a.rating * 20 + a.sold_count))
      .slice(0, limit);
  }

  const viewedProducts = viewedEntries
    .map(([id, score]) => ({ product: products.find((item) => item.id === id), score }))
    .filter((item): item is { product: Product; score: number } => Boolean(item.product));

  const categoryWeights = new Map<string, number>();
  viewedProducts.forEach(({ product, score }) => {
    categoryWeights.set(product.category_id, (categoryWeights.get(product.category_id) || 0) + score);
  });

  return [...products]
    .filter((product) => product.is_active)
    .sort((a, b) => {
      const scoreA = (categoryWeights.get(a.category_id) || 0) * 1000 + (counts[a.id] || 0) * 200 + a.sold_count + a.rating * 10;
      const scoreB = (categoryWeights.get(b.category_id) || 0) * 1000 + (counts[b.id] || 0) * 200 + b.sold_count + b.rating * 10;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getRelatedByViewPreference(products: Product[], current: Product, limit = 4): Product[] {
  const counts = getProductViewCounts();
  return [...products]
    .filter((item) => item.id !== current.id && item.is_active)
    .sort((a, b) => {
      const aSame = a.category_id === current.category_id ? 1 : 0;
      const bSame = b.category_id === current.category_id ? 1 : 0;
      const scoreA = aSame * 1000 + (counts[a.id] || 0) * 100 + a.sold_count;
      const scoreB = bSame * 1000 + (counts[b.id] || 0) * 100 + b.sold_count;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}
