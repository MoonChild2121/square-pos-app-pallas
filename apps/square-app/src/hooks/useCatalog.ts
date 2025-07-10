import { useQuery } from '@tanstack/react-query';

interface ItemVariation {
  id: string;
  itemVariationData: {
    name: string;
    priceMoney: {
      amount: number;
      currency: string;
    };
    imageIds?: string[];
  };
}

interface CatalogItem {
  id: string;
  type: string;
  itemData: {
    name: string;
    categoryId?: string;
    variations: ItemVariation[];
    imageIds?: string[];
    taxIds?: string[];
  };
}

// Create a mapping of variant IDs to image IDs
function createVariantImageMap(items: CatalogItem[]): Record<string, string[]> {
  return items.reduce((acc, item) => {
    const itemImageIds = item.itemData.imageIds || [];
    item.itemData.variations.forEach(variation => {
      acc[variation.id] = variation.itemVariationData.imageIds || itemImageIds;
    });
    return acc;
  }, {} as Record<string, string[]>);
}

// Query keys for React Query
export const catalogKeys = {
  catalog: ['catalog'] as const,
  images: ['catalogImages'] as const,
}

// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  // Client-side
  return ''
}

// Server-side fetch functions
export async function fetchCatalog(): Promise<CatalogItem[]> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/square/catalog`, {
    headers: {
      'Cache-Control': 'max-age=3600',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch catalog');
  const data = await response.json();
  return data.filter((item: any) => item.type === 'ITEM');
}

export async function fetchImages(): Promise<Record<string, string>> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/square/image`, {
    headers: {
      'Cache-Control': 'max-age=3600',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch images');
  return response.json();
}

// Client-side hook
export function useCatalog() {
  const { data: items = [], isLoading: isLoadingCatalog } = useQuery({
    queryKey: catalogKeys.catalog,
    queryFn: fetchCatalog,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const { data: imageData = {}, isLoading: isLoadingImages } = useQuery({
    queryKey: catalogKeys.images,
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const variantImageMap = createVariantImageMap(items);

  const getVariantImageUrl = (variantId: string): string | undefined => {
    const imageIds = variantImageMap[variantId];
    if (!imageIds?.length) return undefined;
    return imageData[imageIds[0]];
  };

  return {
    items,
    imageData,
    getVariantImageUrl,
    isLoading: isLoadingCatalog || isLoadingImages,
  };
} 