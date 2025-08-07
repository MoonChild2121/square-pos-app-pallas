import { Suspense, lazy } from 'react';
import { Header } from '@/components/composites/layout/Header';
import { CatalogSectionSkeleton, CartUISkeleton } from '@/components/composites/loadingSkeletons';
import { CatalogSection } from '@/components/composites/layout/catalog/CatalogSection'; // normal import

// CartUI lazy-loaded
const CartUI = lazy(() =>
  import('@/components/composites/layout/CartUI').then((module) => ({
    default: module.CartUI,
  }))
);

export function HomeContainer() {
  return (
    <>
      <Header />

      <Suspense fallback={<CatalogSectionSkeleton />}>
        <CatalogSection />
      </Suspense>

      <Suspense fallback={<CartUISkeleton />}>
        <CartUI />
      </Suspense>
    </>
  );
}
