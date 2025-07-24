'use client'

import { Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { OrderDetails } from '@/components/composites/orders/OrderDetails'
import Paragraph from '@/components/primitives/ui/typography/paragraph'
import { useCartStore } from '@/shared/stores/useCartStore'
import { OrderSummaryProps } from '@/shared/types/orders'

const emptyOrder = {
  totalMoney: { amount: 0 },
  totalTaxMoney: { amount: 0 },
  totalDiscountMoney: { amount: 0 },
  netAmounts: {
    totalMoney: { amount: 0 },
    taxMoney: { amount: 0 },
    discountMoney: { amount: 0 },
  }
}

export default function OrderSummary({ orderCalc }: OrderSummaryProps) {
  const items = useCartStore(state => state.items)
  const { order, error } = orderCalc
  
  const stickySummaryCss = css({
    position: 'sticky',
    bottom: 0,
    w: '100%', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })
  
  if (items.length === 0) return null

  if (error) {
    return (
      <Box className={stickySummaryCss}>
        <Paragraph color="error">{error}</Paragraph>
      </Box>
    )
  }

  return (
    <Box className={stickySummaryCss} >
      <OrderDetails order={order || emptyOrder} fullWidth />
    </Box>
  )
}