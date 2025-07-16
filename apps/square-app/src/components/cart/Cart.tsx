'use client'

import { memo, useEffect } from 'react'
import { Box, VStack } from '@styled-system/jsx'
import { useCartState, useCartActions } from '@/contexts/CartContext'
import CartItem from './CartItem'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import OrderSummary from '../orders/OrderSummary'
import { OrderSummarySkeleton } from '../skeletons/order-skeletons/OrderSummarySkeleton'
import { css } from '@styled-system/css'
import { useOrderCalculation } from '@/hooks/useOrderCalculation'
import OrderModifierModal from '@/components/modals/OrderModifierModal'

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
  
  const handleCheckout = () => {
    console.log('navigating to checkout')
    router.push('/checkout')
  }

  return (
    <Button 
      width="full" 
      disabled={disabled}
      isLoading={loading}
      onClick={handleCheckout}
    >
      Proceed to Checkout
    </Button>
  )
})

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart = memo(function Cart({ isOpen }: CartProps) {
  const state = useCartState()
  const { setOrder, updateOrderTaxes, updateOrderDiscounts } = useCartActions()
  const isEmpty = state.items.length === 0
  const orderCalc = useOrderCalculation({
    items: state.items,
    debounceMs: 300,
    orderTaxIds: state.orderTaxIds,
    orderDiscountIds: state.orderDiscountIds
  })

  // Store the calculated order in the cart context
  useEffect(() => {
    if (orderCalc.order && !orderCalc.loading && !orderCalc.error) {
      setOrder(orderCalc.order)
    }
  }, [orderCalc.order, orderCalc.loading, orderCalc.error, setOrder])

  return (
    <Box className={css({
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '400px',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      bg: 'surface.container',
      borderRadius: { base: 0, md: 'lg 0 0 lg' },
      boxShadow: '2xl',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 50,
      p: '4',
    })}>
      <CartItemsList items={state.items} />
      <Box mb="2">
        {orderCalc.loading ? (
          <OrderSummarySkeleton />
        ) : (
          <OrderSummary orderCalc={orderCalc} />
        )}
      </Box>
      <VStack gap="2" mt="2">
        <OrderModifierModal
          selectedTaxIds={state.orderTaxIds}
          selectedDiscountIds={state.orderDiscountIds}
          onUpdateTaxes={updateOrderTaxes}
          onUpdateDiscounts={updateOrderDiscounts}
        />
        <CheckoutButton 
          disabled={isEmpty} 
          loading={orderCalc.loading}
        />
      </VStack>
    </Box>
  )
})

export default Cart
