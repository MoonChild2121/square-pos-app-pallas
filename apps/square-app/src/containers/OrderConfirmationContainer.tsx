'use client'

import { useEffect, useCallback } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useCatalog } from '@/hooks/useCatalog'
import { useRouter } from 'next/navigation'
import { OrderConfirmationView } from '@/components/checkout/OrderConfirmationView'

export function OrderConfirmationContainer() {
  const { state, clearCart } = useCart()
  const { getVariantImageUrl, isLoading: catalogLoading } = useCatalog()
  const router = useRouter()

  const handleContinueShopping = useCallback(() => {
    router.push('/menu?clear=true')
  }, [router])

  useEffect(() => {
    // Automatically clear cart after rendering order confirmation
    // Uncomment if you want to clear the cart immediately after viewing this page
    // clearCart()
  }, [clearCart])

  return (
    <OrderConfirmationView
      state={state}
      catalogLoading={catalogLoading}
      getVariantImageUrl={getVariantImageUrl}
      onContinueShopping={handleContinueShopping}
    />
  )
}
