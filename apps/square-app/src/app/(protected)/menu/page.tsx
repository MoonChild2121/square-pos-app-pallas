import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { MenuDashboard } from '@/containers/menu/MenuDashboard'
import { catalogKeys, fetchCatalog, fetchImages } from '@/hooks/useCatalog'

export default async function MenuPage() {
  const queryClient = new QueryClient()

  // Prefetch data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: catalogKeys.catalog,
      queryFn: fetchCatalog,
    }),
    queryClient.prefetchQuery({
      queryKey: catalogKeys.images,
      queryFn: fetchImages,
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MenuDashboard />
    </HydrationBoundary>
  )
} 