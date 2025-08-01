'use client';

import Modal from '@/components/primitives/ui/modal/modal';
import { useState } from 'react';
import { Edit } from 'lucide-react';
import {
  TaxSelect,
  DiscountSelect,
} from '@/components/composites/modifierSelect/SelectTaxDiscount';
import { VStack } from '@styled-system/jsx';
import { cartItem } from '@styled-system/recipes';
import { Box } from '@styled-system/jsx';
import { ModifierModalProps } from '@/components/composites/orderModals/types';

export default function ModifierModal({
  itemId,
  selectedTaxIds = [],
  selectedDiscountIds = [],
}: ModifierModalProps) {
  const [open, setOpen] = useState(false);
  const { button } = cartItem();

  return (
    <>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Box className={button}>
            {' '}
            <Edit size={17} />
          </Box>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Modifiers</Modal.Title>
            <Modal.Description>Select applicable taxes and discounts.</Modal.Description>
          </Modal.Header>
          <VStack gap="gap.inline.sm" py="padding.block.sm">
            <TaxSelect itemId={itemId} selectedTaxIds={selectedTaxIds} />
            <DiscountSelect itemId={itemId} selectedDiscountIds={selectedDiscountIds} />
          </VStack>
          <Modal.Footer>
            <Modal.Cancel>Close</Modal.Cancel>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
