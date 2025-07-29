'use client'

import { memo } from 'react'
import { Box, Flex, VStack } from '@styled-system/jsx'
import { cartSlideout, cartContent, cartControls } from '@styled-system/recipes'
import CartItems from '@/components/composites/cart/CartItem'
import { Button } from '@/components/primitives/ui/button'
import OrderSummary from '@/components/composites/orders/OrderSummary'
import { OrderSummarySkeleton } from '@/components/composites/skeletons/order-skeletons/OrderSummarySkeleton'
import OrderModifierModal from '@/components/composites/modals/OrderModifierModal'
import { CartViewProps } from '@/shared/types/cart/index'
import { Heading } from '@/components/primitives/ui/typography'
import { X } from 'lucide-react'

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
  onClose,
  isRedirecting = false,
}: CartViewProps) {
  const showSummarySkeleton = !isEmpty && orderCalc.loading
  const showOrderSummary = !isEmpty && !orderCalc.loading && orderCalc.order

  return (
    <Box className={cartSlideout({ isOpen, size: { base: 'mobile', md: 'desktop' } })}>
      <Flex justify="flex-end" align="center">
        <Button variant="text" size="icon" aria-label="Close cart" onClick={onClose}>
          <X size={20} />
        </Button>
      </Flex>

      {/* Items */}
      <Box className={cartContent({ isEmpty })}>
        {isEmpty ? (
          <Flex align="center" justify="center">
            <Heading level={5} color="disabled">Your cart is empty</Heading>
          </Flex>
        ) : (
          items.map((item) => <CartItems key={item.id} {...item} />)
        )}
      </Box>

      {/* Summary & Controls */}
      {!isEmpty && (
        <Box className={cartControls({ hasItems: true })}>
          <Box pb="layout.internal.sm">
            {showSummarySkeleton && <OrderSummarySkeleton />}
            {showOrderSummary && <OrderSummary orderCalc={orderCalc} />}
          </Box>

          <VStack gap="layout.internal.sm">
            <OrderModifierModal
              selectedTaxIds={selectedTaxIds}
              selectedDiscountIds={selectedDiscountIds}
              onUpdateTaxes={onUpdateTaxes}
              onUpdateDiscounts={onUpdateDiscounts}
            />
            <Button
              variant="outlined"
              width="full"
              isLoading={orderCalc.loading || isRedirecting}
              onClick={onCheckout}
              disabled={isEmpty || orderCalc.loading || isRedirecting}
            >
              Proceed to Checkout
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  )
})
