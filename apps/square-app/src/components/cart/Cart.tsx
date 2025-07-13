'use client'

import { memo, useEffect } from 'react'
import { Box } from '@styled-system/jsx'
import { useCartState, useCartActions } from '@/contexts/CartContext'
import CartItem from './CartItem'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Heading from '@/components/ui/typography/heading'
import OrderSummary from '../orders/OrderSummary'
import { OrderSummarySkeleton } from '../skeletons/order-skeletons/OrderSummarySkeleton'
import { css } from '@styled-system/css'
import { useOrderCalculation } from '@/hooks/useOrderCalculation'

// Memoized cart items list component
const CartItemsList = memo(function CartItemsList({ items }: { items: any[] }) {
  return (
    <Box
      className={css({
        flex: '1',
        overflowY: 'auto',
        pb: '2',
      })}
    >
      {items.map((item) => (
        <CartItem
          key={item.id}
          {...item}
        />
      ))}
    </Box>
  )
})

// Memoized checkout button component
const CheckoutButton = memo(function CheckoutButton({ 
  disabled,
  loading 
}: { 
  disabled: boolean
  loading: boolean 
}) {
  const router = useRouter()
  
  return (
    <Box className="cartContainer__footer">
      <Button 
        width="full" 
        disabled={disabled}
        isLoading={loading}
        onClick={() => router.push('/checkout')}
      >
        Proceed to Checkout
      </Button>
    </Box>
  )
})

const Cart = memo(function Cart() {
  const state = useCartState()
  const { setOrder } = useCartActions()
  const isEmpty = state.items.length === 0
  const orderCalc = useOrderCalculation({
    items: state.items,
    debounceMs: 300
  })

  // Store the calculated order in the cart context
  useEffect(() => {
    if (orderCalc.order && !orderCalc.loading && !orderCalc.error) {
      setOrder(orderCalc.order)
    }
  }, [orderCalc.order, orderCalc.loading, orderCalc.error, setOrder])

  return (
    <Box className={css({
      display: 'flex',
      flexDirection: 'column',
      h: '100%',
      width: '100%',
      bg: 'surface.container',
      borderRadius: 'lg',
      p: '1',
    })}
    >
      <Box mb="2" className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
      })}>
        <Heading level={4}>Cart Items</Heading>
      </Box>
      <CartItemsList items={state.items} />
      <Box mb="2">
        {orderCalc.loading ? (
          <OrderSummarySkeleton />
        ) : (
          <OrderSummary orderCalc={orderCalc} />
        )}
      </Box>
      <Box mt="2">
        <CheckoutButton 
          disabled={isEmpty} 
          loading={orderCalc.loading}
        />
      </Box>
    </Box>
  )
})

export default Cart
