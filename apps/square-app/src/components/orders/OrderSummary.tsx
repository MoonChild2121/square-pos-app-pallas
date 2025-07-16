'use client'

import { Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { OrderDetails } from '@/components/orders/OrderDetails'
import Paragraph from '@/components/ui/typography/paragraph'
import { useCart } from '@/contexts/CartContext'

const stickySummaryCss = css({
  position: 'sticky',
  bottom: 0,
})

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

interface Money {
  amount: number;
  currency?: string;
}

interface Tax {
  uid: string;
  name: string;
  percentage: number;
  appliedMoney: Money;
}

interface Discount {
  uid: string;
  name: string;
  percentage: number;
  appliedMoney: Money;
}

interface Order {
  totalMoney: Money;
  totalTaxMoney: Money;
  totalDiscountMoney: Money;
  netAmounts: {
    totalMoney: Money;
    taxMoney: Money;
    discountMoney: Money;
  };
  taxes?: Tax[];
  discounts?: Discount[];
}

interface OrderCalc {
  order: Order;
  loading: boolean;
  error?: string;
}

interface OrderSummaryProps {
  orderCalc: OrderCalc;
}

export default function OrderSummary({ orderCalc }: OrderSummaryProps) {
  const { state } = useCart()
  const { order, error } = orderCalc

  if (state.items.length === 0) return null

  if (error) {
    return (
      <Box className={`${stickySummaryCss} cartContainer__summary error`}>
        <Paragraph color="error">{error}</Paragraph>
      </Box>
    )
  }

  return (
    <Box className={`${stickySummaryCss} cartContainer__summary`}>
      <OrderDetails order={order || emptyOrder} />
    </Box>
  )
}
