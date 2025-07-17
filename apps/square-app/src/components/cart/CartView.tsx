'use client'

import { memo } from 'react'
import { Box, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import CartItem from '@/components/cart/CartItem'
import { Button } from '@/components/ui/button'
import OrderSummary from '@/components/orders/OrderSummary'
import { OrderSummarySkeleton } from '@/components/skeletons/order-skeletons/OrderSummarySkeleton'
import OrderModifierModal from '@/components/modals/OrderModifierModal'

interface Props {
  isOpen: boolean
  items: any[]
  isEmpty: boolean
  orderCalc: any
  selectedTaxIds: string[]
  selectedDiscountIds: string[]
  onCheckout: () => void
  onUpdateTaxes: (ids: string[]) => void
  onUpdateDiscounts: (ids: string[]) => void
  onClose: () => void
}

export const CartView = memo(function CartView({
  isOpen,
  items,
  isEmpty,
  orderCalc,
  selectedTaxIds,
  selectedDiscountIds,
  onCheckout,
  onUpdateTaxes,
  onUpdateDiscounts,
}: Props) {
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
      {/* Items */}
      <Box className={css({ flex: '1', overflowY: 'auto', pb: '2' })}>
        {isEmpty ? (
          <Box className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
            fontSize: 'md',
            color: 'text.secondary',
          })}>
            Your cart is empty
          </Box>
        ) : (
          items.map((item) => <CartItem key={item.id} {...item} />)
        )}
      </Box>

      {/* Summary & Controls */}
      {!isEmpty && (
        <>
          <Box mb="2">
            {orderCalc.loading ? (
              <OrderSummarySkeleton />
            ) : (
              <OrderSummary orderCalc={orderCalc} />
            )}
          </Box>
          <VStack gap="2" mt="2">
            <OrderModifierModal
              selectedTaxIds={selectedTaxIds}
              selectedDiscountIds={selectedDiscountIds}
              onUpdateTaxes={onUpdateTaxes}
              onUpdateDiscounts={onUpdateDiscounts}
            />
            <Button 
              width="full"
              isLoading={orderCalc.loading}
              onClick={onCheckout}
            >
              Proceed to Checkout
            </Button>
          </VStack>
        </>
      )}
    </Box>
  )
})
