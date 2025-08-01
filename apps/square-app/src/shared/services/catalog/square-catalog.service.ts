import { CatalogData, ICatalogService } from './interface';
import { Product, Tax, Discount, ModifierData, Money } from '@/shared/types/base';
import {
  CatalogItem,
  CatalogResponse,
  Modifier,
  SearchCatalogResponse,
} from '@/shared/types/catalog';
import JSONBig from 'json-bigint';
import { fetchSquareCatalog, fetchSquareSearch } from './fetch-logic';

// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  return '';
};
// SquareCatalogService implements the ICatalogService interface
export class SquareCatalogService implements ICatalogService {
  private variantImageMap: Record<string, string[]> = {}; // Maps variantId -> imageIds
  private modifierMap: Record<string, ModifierData[]> = {}; // Maps modifierListId -> ModifierData[]
  private imageMap: Record<string, string> = {}; // Maps imageId -> imageUrl
  // Fetch the catalog data from the API
  private async fetchCatalogData(accessToken?: string): Promise<CatalogResponse> {
    // On the server, call the logic function directly
    if (typeof window === 'undefined') {
      if (!accessToken) {
        throw new Error('SquareCatalogService: Access token is required for server-side fetching.');
      }
      // The raw data from the logic function is already in the shape of CatalogResponse
      return fetchSquareCatalog(accessToken);
    }

    // On the client, fetch from the API route
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/square/catalog`;
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'max-age=3600',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (!response.ok) {
      console.error('SquareCatalogService: Failed to fetch catalog', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error('Failed to fetch catalog');
    }
    return response.json();
  }

  // Fetch the search data from the API
  private async fetchSearchData(
    searchTerm: string, // The keyword to search for
    categoryId?: string, // A category to scope the search
    accessToken?: string // The user's access token for authentication
  ): Promise<SearchCatalogResponse> {
    // On the server, call the logic function directly
    if (typeof window === 'undefined') {
      if (!accessToken) {
        throw new Error(
          'SquareCatalogService: Access token is required for server-side searching.'
        );
      }
      return fetchSquareSearch(accessToken, [searchTerm], categoryId);
    }

    // On the client, fetch from the API route
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/square/catalog/search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ keywords: [searchTerm], categoryId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const responseText = await response.text();
    return JSONBig.parse(responseText);
  }

  // Initialize the maps from the catalog data
  private initializeMaps(catalog: CatalogResponse): void {
    this.imageMap = catalog.images || {};

    this.variantImageMap = (catalog.items || []).reduce(
      (acc, item) => {
        if (!item.itemData) return acc;
        const itemImageIds = item.itemData.imageIds || [];
        item.itemData.variations.forEach((variation) => {
          acc[variation.id] = variation.itemVariationData.imageIds || itemImageIds;
        });
        return acc;
      },
      {} as Record<string, string[]>
    );

    this.modifierMap = (catalog.modifiers || []).reduce(
      (acc, modifier) => {
        const listId = modifier.modifierData.modifierListId;
        if (!acc[listId]) {
          acc[listId] = [];
        }
        acc[listId].push({ ...modifier.modifierData, id: modifier.id });
        return acc;
      },
      {} as Record<string, ModifierData[]>
    );
  }

  // Transform the catalog item to a product
  private transformCatalogItemToProduct(item: CatalogItem): Product[] {
    if (!item.itemData || !item.itemData.variations) return [];

    const itemName = item.itemData.name;
    const taxIds = item.itemData.taxIds || [];

    return item.itemData.variations.map((variation) => {
      const price: Money = {
        amount: Number(variation.itemVariationData.priceMoney.amount),
        currency: variation.itemVariationData.priceMoney.currency,
      };

      const modifiers = this.getProductModifiersByItem(item);

      return {
        id: variation.id,
        name: variation.itemVariationData.name || itemName,
        price: price,
        imageUrl: this.getVariantImageUrl(variation.id),
        taxIds: taxIds,
        modifiers: modifiers,
        categoryId: item.id,
        categoryName: itemName,
      };
    });
  }

  // Get the catalog data from the API
  async getCatalog(accessToken?: string): Promise<CatalogData> {
    const rawData = await this.fetchCatalogData(accessToken);
    this.initializeMaps(rawData);

    const products = (rawData.items || []).flatMap((item) =>
      this.transformCatalogItemToProduct(item)
    );

    const taxes = (rawData.taxes || []).map(
      (taxItem): Tax => ({
        uid: taxItem.id,
        name: taxItem.taxData.name,
        percentage: Number(taxItem.taxData.percentage),
        appliedMoney: { amount: 0, currency: 'USD' }, // Placeholder
      })
    );

    const discounts = (rawData.discounts || []).map(
      (discountItem): Discount => ({
        uid: discountItem.id,
        name: discountItem.discountData.name,
        percentage: Number(discountItem.discountData.percentage),
        appliedMoney: { amount: 0, currency: 'USD' }, // Placeholder
      })
    );

    return { products, taxes, discounts, modifierMap: this.modifierMap };
  }

  // Search the catalog for products
  async searchProducts(
    searchTerm: string,
    categoryId?: string,
    accessToken?: string
  ): Promise<Product[]> {
    const data = await this.fetchSearchData(searchTerm, categoryId, accessToken);
    if (!data.objects) return [];

    const relatedObjects = data.relatedObjects || [];

    // Build image map from related objects
    const imageMap = relatedObjects.reduce(
      (acc, obj) => {
        if (obj.type === 'IMAGE' && obj.imageData) {
          acc[obj.id] = (obj.imageData as any).url;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // Create a map of ITEM objects for easy lookup
    const itemMap = relatedObjects.reduce(
      (acc, obj) => {
        if (obj.type === 'ITEM' && obj.itemData) {
          acc[obj.id] = obj;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    // The modifierMap should already be populated from a previous catalog fetch
    // If it's empty, we might need to fetch the full catalog first to get modifier data
    if (Object.keys(this.modifierMap).length === 0) {
      await this.getCatalog(accessToken);
    }

    const products = data.objects
      .map((item): Product | null => {
        if (item.type !== 'ITEM_VARIATION' || !item.itemVariationData) {
          return null;
        }

        const relatedItem = itemMap[item.itemVariationData.itemId];
        if (!relatedItem || !relatedItem.itemData) return null;

        const itemImageId = relatedItem.itemData.imageIds?.[0];
        const variationImageId = item.itemVariationData.imageIds?.[0];
        const imageUrl =
          imageMap[variationImageId || ''] ||
          imageMap[itemImageId || ''] ||
          '/placeholder-image.png';

        const price: Money = {
          amount: Number(item.itemVariationData.priceMoney.amount),
          currency: item.itemVariationData.priceMoney.currency,
        };

        // Get modifiers for this item using the existing helper method
        const modifiers = this.getProductModifiersByItem(relatedItem);

        return {
          id: item.id,
          name: item.itemVariationData.name || '',
          price: price,
          imageUrl,
          taxIds: relatedItem.itemData.taxIds || [],
          modifiers: modifiers,
          categoryId: relatedItem.id,
          categoryName: relatedItem.itemData.name,
        };
      })
      .filter((p): p is Product => p !== null);

    return products;
  }

  // Get the variant image URL
  getVariantImageUrl(variantId: string): string | undefined {
    const imageIds = this.variantImageMap[variantId];
    if (!imageIds?.length) return undefined;
    const imageId = imageIds[0];
    return imageId ? this.imageMap[imageId] : undefined;
  }

  // Get the product modifiers
  getProductModifiers(product: Product): ModifierData[] {
    // This is a simplified lookup. A real implementation might need
    // to re-fetch or look up based on the product's internal composition.
    return product.modifiers || [];
  }

  // Get the product modifiers by item
  private getProductModifiersByItem(item: CatalogItem): ModifierData[] {
    if (!item.itemData || !item.itemData.modifierListInfo) return [];
    const result = item.itemData.modifierListInfo.flatMap((info) => {
      return this.modifierMap[info.modifierListId] || [];
    });
    return result;
  }
}
