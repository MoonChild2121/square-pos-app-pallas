import {
  CatalogData,
  ICatalogService,
} from './interface';
import {
  Product,
  Tax,
  Discount,
  ModifierData,
  Money,
} from '@/shared/types/base';
import {
  CatalogItem,
  CatalogResponse,
  Modifier,
  SearchCatalogResponse,
} from '@/shared/types/catalog';
import JSONBig from 'json-bigint';

// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  return '';
};

export class SquareCatalogService implements ICatalogService {
  private variantImageMap: Record<string, string[]> = {};
  private modifierMap: Record<string, ModifierData[]> = {};
  private imageMap: Record<string, string> = {};

  private async fetchCatalogData(accessToken?: string): Promise<CatalogResponse> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/square/catalog`;
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'max-age=3600',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
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

  private async fetchSearchData(
    searchTerm: string,
    categoryId?: string,
    accessToken?: string
  ): Promise<SearchCatalogResponse> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/square/catalog/search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
      },
      body: JSON.stringify({ keywords: [searchTerm], categoryId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    const responseText = await response.text();
    return JSONBig.parse(responseText);
  }

  private initializeMaps(catalog: CatalogResponse): void {
    this.imageMap = catalog.images || {};
    
    this.variantImageMap = (catalog.items || []).reduce((acc, item) => {
      if (!item.itemData) return acc;
      const itemImageIds = item.itemData.imageIds || [];
      item.itemData.variations.forEach(variation => {
        acc[variation.id] = variation.itemVariationData.imageIds || itemImageIds;
      });
      return acc;
    }, {} as Record<string, string[]>);

    this.modifierMap = (catalog.modifiers || []).reduce((acc, modifier) => {
      const listId = modifier.modifierData.modifierListId;
      if (!acc[listId]) {
        acc[listId] = [];
      }
      acc[listId].push({ ...modifier.modifierData, id: modifier.id });
      return acc;
    }, {} as Record<string, ModifierData[]>);
  }

  private transformCatalogItemToProduct(item: CatalogItem): Product[] {
    if (!item.itemData || !item.itemData.variations) return [];

    const itemName = item.itemData.name;
    const taxIds = item.itemData.taxIds || [];

    return item.itemData.variations.map(variation => {
      const price: Money = {
        amount: Number(variation.itemVariationData.priceMoney.amount),
        currency: variation.itemVariationData.priceMoney.currency,
      };

      return {
        id: variation.id,
        name: variation.itemVariationData.name || itemName,
        price: price,
        imageUrl: this.getVariantImageUrl(variation.id),
        taxIds: taxIds,
        modifiers: this.getProductModifiersByItem(item),
        categoryId: item.id,
        categoryName: itemName,
      };
    });
  }

  async getCatalog(accessToken?: string): Promise<CatalogData> {
    const rawData = await this.fetchCatalogData(accessToken);
    this.initializeMaps(rawData);

    const products = (rawData.items || []).flatMap(item =>
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

    return { products, taxes, discounts };
  }

  async searchProducts(
    searchTerm: string,
    categoryId?: string,
    accessToken?: string
  ): Promise<Product[]> {
    const data = await this.fetchSearchData(searchTerm, categoryId, accessToken);
    if (!data.objects) return [];

    const relatedObjects = data.relatedObjects || [];
    const imageMap = relatedObjects.reduce((acc, obj) => {
      if (obj.type === 'IMAGE' && obj.imageData) {
        acc[obj.id] = (obj.imageData as any).url;
      }
      return acc;
    }, {} as Record<string, string>);

    return data.objects
      .map((item): Product | null => {
        if (item.type !== 'ITEM_VARIATION' || !item.itemVariationData) {
          return null;
        }

        const relatedItem = relatedObjects.find(
          obj => obj.type === 'ITEM' && obj.id === item.itemVariationData?.itemId
        );
        if (!relatedItem || !relatedItem.itemData) return null;

        const itemImageId = relatedItem.itemData.imageIds?.[0];
        const variationImageId = item.itemVariationData.imageIds?.[0];
        const imageUrl =
          imageMap[variationImageId || ''] ||
          imageMap[itemImageId || ''] ||
          '/placeholder-image.jpg';

        const price: Money = {
            amount: Number(item.itemVariationData.priceMoney.amount),
            currency: item.itemVariationData.priceMoney.currency,
        };

        return {
          id: item.id,
          name: item.itemVariationData.name || '',
          price: price,
          imageUrl,
          taxIds: relatedItem.itemData.taxIds || [],
          modifiers: this.getProductModifiersByItem(relatedItem),
          categoryId: relatedItem.id,
          categoryName: relatedItem.itemData.name,
        };
      })
      .filter((p): p is Product => p !== null);
  }

  getVariantImageUrl(variantId: string): string | undefined {
    const imageIds = this.variantImageMap[variantId];
    if (!imageIds?.length) return undefined;
    const imageId = imageIds[0];
    return imageId ? this.imageMap[imageId] : undefined;
  }

  getProductModifiers(product: Product): ModifierData[] {
    // This is a simplified lookup. A real implementation might need
    // to re-fetch or look up based on the product's internal composition.
    return product.modifiers || [];
  }

  private getProductModifiersByItem(item: CatalogItem): ModifierData[] {
    if (!item.itemData || !item.itemData.modifierListInfo) return [];
    return item.itemData.modifierListInfo.flatMap(info => {
      return this.modifierMap[info.modifierListId] || [];
    });
  }
}