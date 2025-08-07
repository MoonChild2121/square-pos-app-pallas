import { getServerSession } from 'next-auth';
import { getCatalogService } from '@/shared/services/service-factory';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchSquareCatalog } from '@/shared/services/catalog/fetch-logic';
import { CatalogUI } from '@/components/composites/layout/catalog/CatalogUI';
import { VStack } from '@styled-system/jsx';
import { css } from '@styled-system/css';
import type { HasInitializeMaps } from '@/shared/types/base';
import { CACHE_TTL, CACHE_PREFIX } from '@/shared/constants';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(userId: string): string {
  return `${CACHE_PREFIX}${userId}`;
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

export async function CatalogSection() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/api/auth/signin');
  }

  // Create cache key based on user session
  const cacheKey = getCacheKey(session.user?.id || 'anonymous');

  // Try to get cached data first
  let data;
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    console.log('Cache hit: Using cached catalog data');
    data = cached.data;
  }

  // If no valid cached data, fetch fresh data
  if (!data) {
    console.log('Cache miss: Fetching fresh catalog data');

    // Get the catalog service
    const catalogService = getCatalogService();

    // Get the catalog data
    const rawData = await fetchSquareCatalog(session.accessToken);
    (catalogService as unknown as HasInitializeMaps).initializeMaps(rawData);
    data = await catalogService.getCatalog(session.accessToken);

    // Cache the fresh data
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
    console.log('Cached fresh catalog data');
  }

  return (
    <VStack
      className={css({
        flex: '1',
        bg: 'surface.container',
        borderRadius: 'lg',
        overflow: 'hidden',
      })}
      px={{ base: 'padding.inline.sm', md: 'padding.inline.lg' }}
      py={{ base: 'padding.block.sm', md: 'padding.block.lg' }}
      gap="layout.section.sm"
    >
      <CatalogUI initialData={data} />
    </VStack>
  );
}
