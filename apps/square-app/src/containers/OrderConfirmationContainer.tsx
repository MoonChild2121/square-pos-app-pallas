'use client'

import { useCallback } from 'react'
import { useCartStore } from '@/shared/stores/useCartStore'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { useRouter } from 'next/navigation'
import { OrderConfirmationView } from '@/components/composites/checkout/OrderConfirmationView'

export function OrderConfirmationContainer() {
  const state = useCartStore()
  const { products, isLoading: catalogLoading } = useCatalog()
  const router = useRouter()

  const getVariantImageUrl = useCallback((variantId: string): string | undefined => {
    const product = products.find(p => p.id === variantId);
    return product?.imageUrl;
  }, [products]);

  const handleContinueShopping = useCallback(() => {
    router.push('/menu?clear=true')
  }, [router])

  return (
    <OrderConfirmationView
      state={state}
      catalogLoading={catalogLoading}
      getVariantImageUrl={getVariantImageUrl}
      onContinueShopping={handleContinueShopping}
    />
  )
}
