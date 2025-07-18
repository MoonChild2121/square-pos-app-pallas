import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { STALE_TIME, GC_TIME } from '@/shared/constants';
import { useMemo } from 'react';
import { getCatalogService } from '../services/service-factory';

const catalogService = getCatalogService();

export function useSearchCatalog(searchTerm: string, categoryId?: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm, categoryId],
    queryFn: () => catalogService.searchProducts(searchTerm, categoryId, accessToken),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken && searchTerm.length >= 2,
  });

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      products: data || [],
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );
}