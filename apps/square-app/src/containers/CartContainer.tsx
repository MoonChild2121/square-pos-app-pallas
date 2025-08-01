'use client';

import { useEffect, memo, useState, useTransition } from 'react';
import { useCartStore } from '@/shared/stores/useCartStore';
import { useOrderCalculation } from '@/shared/hooks/useOrderCalculation';
import { useRouter } from 'next/navigation';
import { CartView } from '@/components/composites/cart/CartView';
import { DEBOUNCE_MS } from '@/shared/constants';
import { CartContainerProps } from '@/shared/types/cart/index';

export const CartContainer = memo(function CartContainer({ isOpen, onClose }: CartContainerProps) {
  const state = useCartStore();
  const { setOrder, updateOrderTaxes, updateOrderDiscounts } = useCartStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEmpty = state.items.length === 0;

  const orderCalc = useOrderCalculation({
    items: state.items,
    debounceMs: DEBOUNCE_MS,
    orderTaxIds: state.orderTaxIds,
    orderDiscountIds: state.orderDiscountIds,
  });

  useEffect(() => {
    if (orderCalc.order && !orderCalc.loading && !orderCalc.error) {
      setOrder(orderCalc.order);
    }
  }, [orderCalc.order, orderCalc.loading, orderCalc.error, setOrder]);

  const router = useRouter();

  const handleCheckout = () => {
    setIsRedirecting(true);
    startTransition(() => {
      router.push('/checkout');
    });
  };

  return (
    <CartView
      isOpen={isOpen}
      items={state.items}
      orderCalc={orderCalc}
      isEmpty={isEmpty}
      onCheckout={handleCheckout}
      onUpdateTaxes={updateOrderTaxes}
      onUpdateDiscounts={updateOrderDiscounts}
      selectedTaxIds={state.orderTaxIds}
      selectedDiscountIds={state.orderDiscountIds}
      onClose={onClose}
      isRedirecting={isPending}
    />
  );
});
