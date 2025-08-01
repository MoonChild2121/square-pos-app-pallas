import { Product, Tax, Discount, ModifierData } from '@/shared/types/base';
/**
 * CatalogData represents the structure of the full product catalog
 * as returned from any catalog provider (e.g., Square, Shopify).
 *
 * This is a normalized internal shape that the rest of the app depends on —
 * completely abstracted away from external APIs' raw responses.
 */
export interface CatalogData {
  products: Product[];
  taxes: Tax[];
  discounts: Discount[];
  modifierMap: Record<string, ModifierData[]>;
}
/**
 * ICatalogService defines the contract that all catalog providers must follow.
 *
 * It is the core interface used by the app to interact with product data,
 * without knowing or depending on any specific provider like Square or Shopify.
 *
 * This enables the Dependency Inversion Principle by ensuring:
 * - The app depends on this interface, not any concrete class.
 * - Provider implementations plug into this contract.
 */
export interface ICatalogService {
  /**
   * Fetches the entire product catalog, including all items, taxes, and discounts.
   * @param accessToken - The user's access token for authentication.
   */
  getCatalog(accessToken?: string): Promise<CatalogData>;

  /**
   * Searches the catalog for products matching a specific term or category.
   * @param searchTerm - The keyword to search for.
   * @param categoryId - A category to scope the search.
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
