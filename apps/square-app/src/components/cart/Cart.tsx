'use client'

import { memo } from 'react'
import { Box } from '@styled-system/jsx'
import { useCartItems } from '@/contexts/CartContext'
import CartItem from './CartItem'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Heading from '@/components/ui/typography/heading'
import OrderSummary from './OrderSummary'
import { css } from '@styled-system/css'

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
const CheckoutButton = memo(function CheckoutButton({ disabled }: { disabled: boolean }) {
  const router = useRouter()
  
  return (
    <Box className="cartContainer__footer">
      <Button 
        width="full" 
        disabled={disabled}
        onClick={() => router.push('/checkout')}
      >
        Proceed to Checkout
      </Button>
    </Box>
  )
})

const Cart = memo(function Cart() {
  const items = useCartItems()
  const isEmpty = items.length === 0

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
      <CartItemsList items={items} />
      <Box mb="2">
        <OrderSummary />
      </Box>
      <Box mt="2">
        <CheckoutButton disabled={isEmpty} />
      </Box>
    </Box>
  )
})

export default Cart
