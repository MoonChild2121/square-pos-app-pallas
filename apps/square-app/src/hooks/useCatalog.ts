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

interface TaxItem {
  id: string;
  type: string;
  taxData: {
    name: string;
    calculationPhase: string;
    inclusionType: string;
    percentage: string;
    appliesToCustomAmounts: boolean;
    enabled: boolean;
  };
}

interface DiscountItem {
  id: string;
  type: string;
  discountData: {
    name: string;
    discountType: string;
    percentage?: string;
    amountMoney?: {
      amount: number;
      currency: string;
    };
    pinRequired: boolean;
    modifyTaxBasis: boolean;
  };
}

interface CatalogResponse {
  items: CatalogItem[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
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
  }, {} as Record<string, string[]>);
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
  
  console.log('fetchCatalog: Starting request', {
    baseUrl,
    hasAccessToken: !!accessToken
  })
  // fetch the catalog
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'max-age=3600',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
    next: {
      revalidate: 300 // 5 minutes
    }
  });
// get the response text
  const responseText = await response.text()
  // log the response
  console.log('fetchCatalog: Received response', {
    status: response.status,
    statusText: response.statusText,
    url,
    headers: Object.fromEntries(response.headers.entries()),
    contentLength: responseText.length
  })
  // if the response is not ok, log the error
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

  // parse the response
  try {
    const data = JSON.parse(responseText)
    
    console.log('fetchCatalog: Successfully parsed response', {
      itemCount: data.items?.length || 0,
      taxCount: data.taxes?.length || 0,
      discountCount: data.discounts?.length || 0,
      imageCount: Object.keys(data.images || {}).length
    })
    
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

export function useCatalog({ initialData }: UseCatalogOptions = {}) { // use the useQuery hook to fetch the catalog
  const { data = initialData || { items: [], taxes: [], discounts: [], images: {} }, isLoading } = useQuery({
    queryKey: catalogKeys.all,
    queryFn: () => fetchCatalog(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false, // don't refetch on window focus
    refetchOnMount: false, // don't refetch on mount
    initialData, // initial data
  });

  const variantImageMap = createVariantImageMap(data.items); // create a mapping of variant IDs to image IDs

  const getVariantImageUrl = (variantId: string): string | undefined => { // get the image URL for a variant
    const imageIds = variantImageMap[variantId];
    if (!imageIds?.length) return undefined; // if the variant has no image, return undefined
    return data.images[imageIds[0]]; // return the image URL
  };

  return {
    items: data.items, // items
    taxes: data.taxes, // taxes
    discounts: data.discounts, // discounts
    imageData: data.images, // image data
    getVariantImageUrl, // get the image URL for a variant
    isLoading, // is loading
  };
} 