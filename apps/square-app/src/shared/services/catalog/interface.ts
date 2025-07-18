import { Product, Tax, Discount, ModifierData } from '@/shared/types/base';

export interface CatalogData {
  products: Product[];
  taxes: Tax[];
  discounts: Discount[];
}

export interface ICatalogService {
  /**
   * Fetches the entire product catalog, including all items, taxes, and discounts.
   * @param accessToken - The user's access token for authentication.
   */
  getCatalog(accessToken?: string): Promise<CatalogData>;

  /**
   * Searches the catalog for products matching a specific term or category.
   * @param searchTerm - The keyword to search for.
   * @param categoryId - An optional category to scope the search.
   * @param accessToken - The user's access token for authentication.
   */
  searchProducts(searchTerm: string, categoryId?: string, accessToken?: string): Promise<Product[]>;

  /**
   * Retrieves the URL for a given product variant's image.
   * @param variantId - The ID of the product variant.
   */
  getVariantImageUrl(variantId: string): string | undefined;

  /**
   * Retrieves all applicable modifiers for a given product.
   * @param product - The product for which to get modifiers.
   */
  getProductModifiers(product: Product): ModifierData[];
}