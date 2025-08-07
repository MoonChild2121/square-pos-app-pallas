'use client';
import { memo, Suspense, lazy } from 'react';
import { Box, Flex, VStack, HStack } from '@styled-system/jsx';
import { cartSlideout, cartContent, cartControls } from '@styled-system/recipes';
import { Button } from '@/components/primitives/ui/button';
import { Heading } from '@/components/primitives/ui/typography';
import { OrderSummarySkeleton } from '@/components/composites/loadingSkeletons/order-skeletons/OrderSummarySkeleton';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { css } from '@styled-system/css';
import type { CartViewProps } from '@/shared/types/cart/index';
import { useCartStore } from '@/shared/stores/useCartStore';
import { formatMoney } from '@/shared/utils/helpers';

// Lazy-loaded heavy components
const CartItems = lazy(() =>
  import('@/components/composites/cart/CartItem').then((m) => ({ default: m.default }))
);
const OrderSummary = lazy(() =>
  import('@/components/composites/orders/OrderSummary').then((m) => ({ default: m.default }))
);
const OrderModifierModal = lazy(() =>
  import('@/components/composites/orderModals/OrderModifierModal').then((m) => ({
    default: m.default,
  }))
);

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
  const showSummarySkeleton = !isEmpty && orderCalc.loading;
  const showOrderSummary = !isEmpty && !orderCalc.loading && orderCalc.order;
  const orderDiscountIds = useCartStore((state) => state.orderDiscountIds);

  // Format total for display
  const totalAmount =
    showOrderSummary && orderCalc.order ? formatMoney(orderCalc.order.totalMoney.amount) : null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box className={cartSlideout({ isOpen, size: { base: 'mobile', md: 'desktop' } })}>
      {/* Close button */}
      <Flex justify="flex-end" align="center">
        <Button variant="text" size="icon" aria-label="Close cart" onClick={onClose}>
          <X size={20} />
        </Button>
      </Flex>

      {/* Items */}
      <Box className={cartContent({ isEmpty })}>
        {isEmpty ? (
          <Flex align="center" justify="center">
            <Heading level={5} color="disabled">
              Your cart is empty
            </Heading>
          </Flex>
        ) : (
          <Suspense fallback={<div>Loading items…</div>}>
            {items.map((item) => (
              <CartItems key={item.id} {...item} />
            ))}
          </Suspense>
        )}
      </Box>

      {/* Summary & Controls */}
      {!isEmpty && (
        <Box className={cartControls({ hasItems: true })}>
          <Box pb="layout.internal.sm">
            {showSummarySkeleton && <OrderSummarySkeleton />}
            {showOrderSummary && (
              <Suspense fallback={<OrderSummarySkeleton />}>
                <OrderSummary orderCalc={orderCalc} />
              </Suspense>
            )}
          </Box>
          <VStack gap="layout.internal.sm">
            <Suspense fallback={null}>
              <OrderModifierModal
                selectedTaxIds={selectedTaxIds}
                selectedDiscountIds={selectedDiscountIds}
                onUpdateTaxes={onUpdateTaxes}
                onUpdateDiscounts={onUpdateDiscounts}
              />
            </Suspense>

            {/* Enhanced Checkout Button */}
            <Button
              variant="outlined"
              width="full"
              size="lg"
              isLoading={orderCalc.loading || isRedirecting}
              onClick={onCheckout}
              disabled={isEmpty || orderCalc.loading || isRedirecting}
              className={css({
                boxShadow: 'lg',
                mb: 'padding.block.md',
                color: 'primary',
                _hover: {
                  transform: 'translateY(-1px)',
                  boxShadow: 'xl',
                },
                transition: 'all 0.2s ease-in-out',
                fontWeight: 'semibold',
              })}
            >
              <HStack gap="2" justify="space-between" className={css({ width: '100%' })}>
                <HStack gap="2">
                  <ShoppingCart size={20} />
                  <Box>
                    Checkout
                    {itemCount > 0 && (
                      <Box
                        className={css({
                          fontSize: 'sm',
                          opacity: 0.9,
                          ml: 1,
                          display: 'inline',
                        })}
                      >
                        ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </Box>
                    )}
                  </Box>
                </HStack>

                <HStack gap="2">
                  {totalAmount && (
                    <Box
                      className={css({
                        fontSize: 'lg',
                        fontWeight: 'bold',
                        color: 'primary',
                      })}
                    >
                      {totalAmount}
                    </Box>
                  )}
                  <ArrowRight size={20} />
                </HStack>
              </HStack>
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
});
