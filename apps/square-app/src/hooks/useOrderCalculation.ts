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
  orderTaxIds?: string[]
  orderDiscountIds?: string[]
}

// Helper function to generate short unique IDs
function generateShortId(prefix: string, itemId: string, modifierId: string): string {
  // Take first 8 chars of each ID to keep it short but still unique
  const shortItemId = itemId.slice(0, 8)
  const shortModifierId = modifierId.slice(0, 8)
  return `${prefix}_${shortItemId}_${shortModifierId}`
}

// Helper to extract base product ID from composite cart item ID
function getBaseProductId(cartItemId: string): string {
  // If the ID contains a modifier (format: productId-modifierId)
  // return only the productId part
  const parts = cartItemId.split('-')
  return parts[0]
}

export function useOrderCalculation({ 
  items, 
  debounceMs = 300,
  orderTaxIds = [],
  orderDiscountIds = []
}: UseOrderCalculationProps) {
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Memoize line items transformation
  const lineItems = useMemo(() => items.map(item => {
    // Get the base product ID for the catalog reference
    const baseProductId = getBaseProductId(item.id)
    
    return {
      quantity: String(item.quantity),
      catalogObjectId: baseProductId, // Use base product ID here
      appliedTaxes: item.taxIds?.map(taxId => ({
        taxUid: taxId,
        uid: generateShortId('tax', item.id, taxId),
      })) || [],
      appliedDiscounts: item.discountIds?.map(discountId => ({
        discountUid: discountId,
        uid: generateShortId('dis', item.id, discountId),
      })) || [],
      // Add modifiers if present
      ...(item.selectedModifier && {
        modifiers: [{
          catalogObjectId: item.selectedModifier.id,
          uid: generateShortId('mod', item.id, item.selectedModifier.id),
        }],
      }),
    }
  }), [items])

  // Create arrays of unique taxes and discounts
  const { taxes, discounts } = useMemo(() => {
    const uniqueTaxes = new Set<string>()
    const uniqueDiscounts = new Set<string>()

    // Add item-level modifiers
    items.forEach(item => {
      item.taxIds?.forEach(taxId => uniqueTaxes.add(taxId))
      item.discountIds?.forEach(discountId => uniqueDiscounts.add(discountId))
    })

    // Add order-level modifiers
    orderTaxIds.forEach(taxId => uniqueTaxes.add(taxId))
    orderDiscountIds.forEach(discountId => uniqueDiscounts.add(discountId))

    return {
      taxes: Array.from(uniqueTaxes).map(taxId => ({
        uid: taxId,
        catalogObjectId: taxId,
        scope: orderTaxIds.includes(taxId) ? 'ORDER' : 'LINE_ITEM',
        type: 'ADDITIVE'
      })),
      discounts: Array.from(uniqueDiscounts).map(discountId => ({
        uid: discountId,
        catalogObjectId: discountId,
        scope: orderDiscountIds.includes(discountId) ? 'ORDER' : 'LINE_ITEM'
      }))
    }
  }, [items, orderTaxIds, orderDiscountIds])

  const requestPayload = useMemo(() => ({
    order: {
      locationId: 'LZQE34F36831W',
      lineItems,
      taxes,
      discounts,
      pricingOptions: {
        autoApplyDiscounts: false,
        autoApplyTaxes: false,
      },
    },
  }), [lineItems, taxes, discounts])

  const debouncedCalculate = useCallback(
    debounce(async (payload) => {
      setLoading(true)
      try {
        console.log('Calculating order with payload:', JSON.stringify(payload, null, 2))
        const response = await fetch('/api/square/orders/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        const data = await response.json()
        console.log('Order calculation response:', data)
        setOrderResponse({ data })
      } catch (err) {
        console.error('Order calculation error:', err)
        setOrderResponse({ data: null, error: 'Failed to load order summary' })
      } finally {
        setLoading(false)
      }
    }, debounceMs),
    []
  )

  useEffect(() => {
    if (items.length > 0) {
      debouncedCalculate(requestPayload)
    } else {
      setOrderResponse(null)
    }

    return () => {
      debouncedCalculate.cancel()
    }
  }, [items, requestPayload, debouncedCalculate])

  return {
    orderResponse,
    loading,
    order: loading ? orderResponse?.data?.order : orderResponse?.data?.order,
    error: orderResponse?.error
  }
} 