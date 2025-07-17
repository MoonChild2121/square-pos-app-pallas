'use client'

import { useEffect, useCallback } from 'react'
import { useCart } from '@/shared/contexts/CartContext'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { useRouter } from 'next/navigation'
import { OrderConfirmationView } from '@/components/checkout/OrderConfirmationView'

export function OrderConfirmationContainer() {
  const { state, clearCart } = useCart()
  const { getVariantImageUrl, isLoading: catalogLoading } = useCatalog()
  const router = useRouter()

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
