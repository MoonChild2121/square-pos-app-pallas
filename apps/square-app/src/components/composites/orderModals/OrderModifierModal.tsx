'use client'

import { Box, VStack } from '@styled-system/jsx'
import  Modal from '@/components/primitives/ui/modal/modal'
import { Button } from '@/components/primitives/ui/button'
import { TaxSelect, DiscountSelect } from '@/components/composites/modifierSelect/SelectTaxDiscount'
import { Edit } from 'lucide-react'
import { OrderModifierModalProps } from '@/components/composites/orderModals/types'
import { css } from '@styled-system/css'

export default function OrderModifierModal({
  selectedTaxIds,
  selectedDiscountIds,
  onUpdateTaxes,
  onUpdateDiscounts
}: OrderModifierModalProps) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button variant="primary" width="full"
        className={css({
          boxShadow: 'sm',
        })}
        >
          <Edit size={20} />
          <Box ml="padding.inline.sm">Order Modifiers</Box>
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Order Modifiers</Modal.Title>
          <Modal.Description>
            Apply taxes and discounts to the entire order
          </Modal.Description>
        </Modal.Header>
        <VStack gap="gap.inline.sm" py="padding.block.sm">
          <TaxSelect
            itemId="order"
            selectedTaxIds={selectedTaxIds}
            isOrderLevel={true}
          />
          <DiscountSelect
            itemId="order"
            selectedDiscountIds={selectedDiscountIds}
            isOrderLevel={true}
          />
        </VStack>
        <Modal.Footer>
          <Modal.Cancel asChild>
            <Button variant="outlined">Close</Button>
          </Modal.Cancel>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
} 