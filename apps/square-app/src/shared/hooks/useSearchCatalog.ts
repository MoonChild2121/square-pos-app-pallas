import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { STALE_TIME, GC_TIME } from '@/shared/constants';
import { useMemo } from 'react';
import { getCatalogService } from '../services/service-factory';

const catalogService = getCatalogService(); // get the catalog service

export function useSearchCatalog(searchTerm: string, categoryId?: string) {
  const { data: session } = useSession(); // get the session data
  const accessToken = session?.accessToken; // get the access token

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm, categoryId], // the query key
    queryFn: () => catalogService.searchProducts(searchTerm, categoryId, accessToken), // the query function
    staleTime: STALE_TIME, // the stale time
    gcTime: GC_TIME, // the garbage collection time
    enabled: !!accessToken && searchTerm.length >= 2, // the enabled condition
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