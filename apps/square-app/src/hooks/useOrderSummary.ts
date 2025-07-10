import { useQuery } from '@tanstack/react-query'
import { useCartItems } from '@/contexts/CartContext'

interface OrderSummaryResponse {
  order: {
    totalMoney: { amount: number; currency: string }
    totalTaxMoney: { amount: number; currency: string }
    totalDiscountMoney?: { amount: number; currency: string }
    subtotalMoney?: { amount: number; currency: string }

    discounts?: Array<{
      uid: string
      name: string
      percentage?: string
      appliedMoney: {
        amount: number
        currency: string
      }
    }>

    taxes?: Array<{
      uid: string
      name: string
      percentage?: string
      appliedMoney: {
        amount: number
        currency: string
      }
    }>

    lineItems: Array<{
      uid: string
      quantity: string
      totalMoney: {
        amount: number
        currency: string
      }
      catalogObjectId: string
    }>
  }
}


export function useOrderSummary() {
  const items = useCartItems()
  
  return useQuery({
    queryKey: ['orderSummary', items],
    queryFn: async () => {
      if (items.length === 0) {
        return null
      }

      const response = await fetch('/api/square/orders/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            discounts: [],
            locationId: "LZQE34F36831W",
            pricingOptions: {
              autoApplyDiscounts: true,
              autoApplyTaxes: true,
            },
            lineItems: items.map(item => ({
              quantity: String(item.quantity),
              catalogObjectId: item.id,
              appliedTaxes: item.taxIds?.map(taxId => ({
                taxUid: taxId,
                uid: taxId
              })) || []
            }))
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate order summary')
      }

      const data = await response.json()
      return data as OrderSummaryResponse
    },
    enabled: items.length > 0,
  })
} 