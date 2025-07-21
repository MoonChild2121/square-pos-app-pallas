// React Query hook for caching and managing async data
import { useQuery } from '@tanstack/react-query';
// Provides session data including accessToken via NextAuth
import { useSession } from 'next-auth/react';
// Time constants for React Query caching and garbage collection
import { STALE_TIME, GC_TIME } from '@/shared/constants';
// CatalogData describes the shape of the full catalog result (products, taxes, discounts)
import { CatalogData } from '../services/catalog/interface';
// Factory function that returns the correct implementation of ICatalogService
import { getCatalogService } from '../services/service-factory';

// Get a singleton instance of the current catalog service (e.g., SquareCatalogService)
// This instance is selected based on configuration (e.g., environment variable)
const catalogService = getCatalogService();

// React Query key for the catalog query. Used for caching, invalidation, and refetching
export const catalogKeys = {
  all: ['catalog'] as const, // `as const` ensures this is treated as a literal tuple
};

// Optional config for the hook: allows providing fallback or server-prefetched data
interface UseCatalogOptions {
  initialData?: CatalogData;
}

/**
 * Custom React hook to fetch and manage the product catalog.
 * 
 * Abstracts data fetching logic using the ICatalogService interface,
 * so the calling component doesn’t know or care which backend/provider is used.
 * 
 * Uses React Query for caching, background refetching, and stale data handling.
 */
export function useCatalog({ initialData }: UseCatalogOptions = {}) {
  // Get the current user session, including the access token (from NextAuth)
  const { data: session } = useSession();

  // Extract the access token from the session. Required to fetch protected catalog data.
  const accessToken = session?.accessToken;

  // useQuery automatically handles caching, loading states, retries, etc.
  const { data, isLoading, error } = useQuery({
    // Cache key to identify this specific query
    queryKey: catalogKeys.all,

    // The actual fetch function: asks the injected catalogService to return data
    queryFn: () => catalogService.getCatalog(accessToken),

    // How long the data is considered fresh (prevents unnecessary refetching)
    staleTime: STALE_TIME,

    // How long React Query keeps the data in memory after it becomes unused
    gcTime: GC_TIME,

    // Prevent refetching on window focus or component remount
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    // If preloaded data is passed in (e.g., from SSR), use it initially
    initialData,

    // Only fetch if access token is available (i.e., user is authenticated)
    enabled: !!accessToken,
  });

  // Return a normalized structure for easy usage in UI components
  return {
    products: data?.products || [],     // fallback to empty array if undefined
    taxes: data?.taxes || [],
    discounts: data?.discounts || [],
    isLoading,                          // indicates loading state for UI feedback
    error,                              // holds error object if query failed
  };
}
