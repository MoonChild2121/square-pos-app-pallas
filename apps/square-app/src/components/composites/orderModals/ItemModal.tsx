'use client';
import Modal from '@/components/primitives/ui/modal/modal';
import { useState } from 'react';
import { DiscountSelect } from '@/components/composites/modifierSelect/EditCheckbox';
import { VStack } from '@styled-system/jsx';
import { cartItem } from '@styled-system/recipes';
import { Button } from '@/components/primitives/ui/button';
import { ModifierModalProps } from '@/components/composites/orderModals/types';
import { useCartStore } from '@/shared/stores/useCartStore';

export default function ModifierModal({
  itemId,
  selectedTaxIds = [],
  selectedDiscountIds = [],
}: ModifierModalProps) {
  const [open, setOpen] = useState(false);
  const { button } = cartItem();
  const orderDiscountIds = useCartStore((state) => state.orderDiscountIds);

  return (
    <>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Button variant="primary" size="sm" className={button} aria-label="Add discounts to item">
            Discounts
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Discounts</Modal.Title>
            <Modal.Description>Select applicable discounts for this item.</Modal.Description>
          </Modal.Header>
          <VStack gap="gap.inline.sm" py="padding.block.sm">
            <DiscountSelect
              itemId={itemId}
              selectedDiscountIds={selectedDiscountIds}
              orderDiscountIds={orderDiscountIds}
            />
          </VStack>
          <Modal.Footer>
            <Modal.Cancel>Close</Modal.Cancel>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
