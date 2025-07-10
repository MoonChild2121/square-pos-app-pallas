import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import { CartItem } from '@/contexts/CartContext'

interface OrderResponse {
  data: any
  error?: string
}

interface UseOrderCalculationProps {
  items: CartItem[]
  debounceMs?: number
}

export function useOrderCalculation({ items, debounceMs = 300 }: UseOrderCalculationProps) {
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Memoize line items transformation
  const lineItems = useMemo(() => items.map(item => ({
    quantity: String(item.quantity),
    catalogObjectId: item.id,
    appliedTaxes: item.taxIds?.map(taxId => ({
      taxUid: taxId,
      uid: taxId,
    })) || [],
  })), [items])

  // Memoize the request payload
  const requestPayload = useMemo(() => ({
    order: {
      locationId: 'LZQE34F36831W',
      discounts: [],
      pricingOptions: {
        autoApplyDiscounts: true,
        autoApplyTaxes: true,
      },
      lineItems,
    },
  }), [lineItems])

  // Create debounced calculate function
  const debouncedCalculate = useCallback(
    debounce(async (payload) => {
      setLoading(true)
      try {
        const response = await fetch('/api/square/orders/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        const data = await response.json()
        setOrderResponse({ data })
      } catch (err) {
        setOrderResponse({ data: null, error: 'Failed to load order summary' })
      } finally {
        setLoading(false)
      }
    }, debounceMs),
    []
  )

  // Effect to trigger calculation when items change
  useEffect(() => {
    if (items.length > 0) {
      debouncedCalculate(requestPayload)
    } else {
      setOrderResponse(null)
    }

    // Cleanup
    return () => {
      debouncedCalculate.cancel()
    }
  }, [items, requestPayload, debouncedCalculate])

  return {
    orderResponse,
    loading,
    // Keep previous data while loading
    order: loading ? orderResponse?.data?.order : orderResponse?.data?.order,
    error: orderResponse?.error
  }
} 