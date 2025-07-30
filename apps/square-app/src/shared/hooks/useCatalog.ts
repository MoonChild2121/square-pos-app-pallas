import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { STALE_TIME, GC_TIME } from '@/shared/constants';
import { CatalogData } from '../services/catalog/interface';
import { getCatalogService } from '../services/service-factory';

const catalogService = getCatalogService();

export const catalogKeys = {
  all: ['catalog'] as const,
};

interface UseCatalogOptions {
  initialData?: CatalogData;
}

// Fetches and caches catalog data using React Query
export function useCatalog({ initialData }: UseCatalogOptions = {}) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: catalogKeys.all,
    queryFn: () => catalogService.getCatalog(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    initialData, // This is the initial data for the menu dashboard
    enabled: !!accessToken,
  });

  return {
    products: data?.products || [],
    taxes: data?.taxes || [],
    discounts: data?.discounts || [],
    modifierMap: data?.modifierMap || {},
    isLoading,
    error,
  };
}
