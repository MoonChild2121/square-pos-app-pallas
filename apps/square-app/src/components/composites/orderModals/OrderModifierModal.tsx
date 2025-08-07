'use client';
import { Box, VStack } from '@styled-system/jsx';
import Modal from '@/components/primitives/ui/modal/modal';
import { Button } from '@/components/primitives/ui/button';
import { useState } from 'react';
import { DiscountSelect } from '@/components/composites/modifierSelect/EditCheckbox';
import { Edit } from 'lucide-react';
import { OrderModifierModalProps } from '@/components/composites/orderModals/types';
import { css } from '@styled-system/css';
import { useCartStore } from '@/shared/stores/useCartStore';

export default function OrderDiscountModal({
  selectedTaxIds = [],
  selectedDiscountIds = [],
}: OrderModifierModalProps) {
  const [open, setOpen] = useState(false);
  const orderDiscountIds = useCartStore((state) => state.orderDiscountIds);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button
          variant="primary"
          width="full"
          className={css({
            boxShadow: 'sm',
          })}
          aria-label="Configure order discounts"
        >
          <Edit size={20} />
          <Box ml="padding.inline.md">Order Discounts</Box>
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Order Discounts</Modal.Title>
          <Modal.Description>Apply discounts to the entire order</Modal.Description>
        </Modal.Header>
        <VStack gap="gap.inline.sm" py="padding.block.sm">
          <DiscountSelect
            itemId="order"
            selectedDiscountIds={orderDiscountIds}
            orderDiscountIds={orderDiscountIds}
            isOrderLevel={true}
            disableSelectedOrderLevelDiscounts={true}
          />
        </VStack>
        <Modal.Footer>
          <Modal.Cancel asChild>
            <Button variant="outlined">Close</Button>
          </Modal.Cancel>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
