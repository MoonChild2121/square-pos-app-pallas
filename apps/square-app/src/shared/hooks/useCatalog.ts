import { useQuery } from '@tanstack/react-query';
import { Modifier, CatalogItem, CatalogResponse } from '@/shared/types/catalog'
import type { ModifierData } from '@/shared/types/modifiers'
import { REVALIDATE_INTERVAL, STALE_TIME, GC_TIME } from '@/shared/constants'

// modeling structure of square catalog api response

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

// Create a mapping of modifier list IDs to modifiers
function createModifierMap(modifiers: Modifier[] = []): Record<string, ModifierData[]> {
  return modifiers.reduce((acc, modifier) => {
    const listId = modifier.modifierData.modifierListId;
    if (!acc[listId]) {
      acc[listId] = [];
    }
    // Include the modifier's ID in the ModifierData
    acc[listId].push({
      ...modifier.modifierData,
      id: modifier.id
    });
    return acc;
  }, {} as Record<string, ModifierData[]>);
}

// Query keys for React Query
export const catalogKeys = {
  all: ['catalog'] as const,
}

// Helper to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  return ''
}

// Server-side fetch function
export async function fetchCatalog(accessToken?: string): Promise<CatalogResponse> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/square/catalog`

  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'max-age=3600',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
    next: {
      revalidate: REVALIDATE_INTERVAL 
    }
  });

  const responseText = await response.text()
  
  if (!response.ok) {
    console.error('fetchCatalog: Request failed', {
      status: response.status,
      statusText: response.statusText,
      url,
      responseBody: responseText,
      headers: Object.fromEntries(response.headers.entries())
    })
    throw new Error(`Failed to fetch catalog: ${response.status} ${response.statusText}`)
  }

  try {
    const data = JSON.parse(responseText)
    
    return data
  } catch (error) {
    console.error('fetchCatalog: Failed to parse JSON response', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseText: responseText.slice(0, 200) + '...'
    })
    throw new Error('Failed to parse catalog response')
  }
}

interface UseCatalogOptions {
  initialData?: CatalogResponse;
}

export function useCatalog({ initialData }: UseCatalogOptions = {}) {
  const defaultData: CatalogResponse = { items: [], taxes: [], discounts: [], images: {}, modifiers: [] };
  const { data = initialData || defaultData, isLoading } = useQuery({
    queryKey: catalogKeys.all,
    queryFn: () => fetchCatalog(),
    staleTime: STALE_TIME, // 5 minutes
    gcTime: GC_TIME, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData,
  });

  const variantImageMap = createVariantImageMap(data.items);
  const modifierMap = createModifierMap(data.modifiers);

  const getVariantImageUrl = (variantId: string): string | undefined => {
    const imageIds = variantImageMap[variantId];
    if (!imageIds?.length) return undefined;
    const imageId = imageIds[0];
    return imageId ? data.images[imageId] : undefined;
  };

  const getItemModifiers = (item: CatalogItem): ModifierData[] => {
    if (!item.itemData.modifierListInfo) return [];
    return item.itemData.modifierListInfo.flatMap(info => {
      const modifiers = modifierMap[info.modifierListId] || [];
      return modifiers;
    });
  };

  return {
    items: data.items,
    taxes: data.taxes,
    discounts: data.discounts,
    imageData: data.images,
    modifiers: data.modifiers,
    getVariantImageUrl,
    getItemModifiers,
    isLoading,
  };
} 