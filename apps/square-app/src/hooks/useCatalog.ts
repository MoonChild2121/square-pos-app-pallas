import { useQuery } from '@tanstack/react-query';

// modeling structure of square catalog api response
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

interface CatalogResponse { //what your API endpoint returns
  items: CatalogItem[];
  images: Record<string, string>;
}

// Create a mapping of variant IDs to image IDs
function createVariantImageMap(items: CatalogItem[]): Record<string, string[]> {
  return items.reduce((acc, item) => {
    const itemImageIds = item.itemData.imageIds || [];
    item.itemData.variations.forEach(variation => {
      acc[variation.id] = variation.itemVariationData.imageIds || itemImageIds;
    });
    return acc;
  }, {} as Record<string, string[]>); //{ 'VARIANT_ID_123': ['IMAGE_ID_abc'] }
}

// Query keys for React Query
export const catalogKeys = {
  all: ['catalog'] as const,
}

// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  // Client-side
  return '' //the server, it returns an absolute URL (used for SSR) On the client, it returns an empty string, so fetch('/api/...') works as relative
}

// Server-side fetch function
export async function fetchCatalog(accessToken?: string): Promise<CatalogResponse> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/square/catalog`, {
    headers: {
      'Cache-Control': 'max-age=3600',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
    next: {
      revalidate: 300 // 5 minutes
    }
  });
  if (!response.ok) throw new Error('Failed to fetch catalog');
  return response.json();
}

interface UseCatalogOptions {
  initialData?: CatalogResponse;
}

// Client-side hook
//populates client-side React Query without a network request
export function useCatalog({ initialData }: UseCatalogOptions = {}) {
  const { data = initialData || { items: [], images: {} }, isLoading } = useQuery({
    queryKey: catalogKeys.all,
    queryFn: () => fetchCatalog(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData,
  });

  const variantImageMap = createVariantImageMap(data.items);

  const getVariantImageUrl = (variantId: string): string | undefined => {
    const imageIds = variantImageMap[variantId];
    if (!imageIds?.length) return undefined;
    return data.images[imageIds[0]];
  };

  return {
    items: data.items,
    imageData: data.images,
    getVariantImageUrl,
    isLoading,
  };
} 