'use client'

import { useCart } from '@/contexts/CartContext'
import { Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { OrderDetails } from '@/components/cart/OrderDetails'
import Paragraph from '@/components/ui/typography/paragraph'
import { useOrderCalculation } from '@/hooks/useOrderCalculation'

const stickySummaryCss = css({
  position: 'sticky',
  bottom: 0,
})

const emptyOrder = {
  totalMoney: { amount: 0 },
  totalTaxMoney: { amount: 0 },
  totalDiscountMoney: { amount: 0 },
}

export default function OrderSummary() {
  const { state } = useCart()
  const { order, loading, error } = useOrderCalculation({
    items: state.items,
    debounceMs: 300
  })

  if (state.items.length === 0) return null

  if (error) {
    return (
      <Box className={`${stickySummaryCss} cartContainer__summary error`}>
        <Paragraph color="error">{error}</Paragraph>
      </Box>
    )
  }

  return (
    <Box className={stickySummaryCss}>
      <OrderDetails order={order || emptyOrder} />
    </Box>
  )
}
