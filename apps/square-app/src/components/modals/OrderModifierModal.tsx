'use client'

import { Box, VStack } from '@styled-system/jsx'
import  Modal from '@/components/ui/modal/modal'
import { Button } from '@/components/ui/button'
import { TaxSelect, DiscountSelect } from '@/components/common/Select'
import { Settings } from 'lucide-react'

interface OrderModifierModalProps {
  selectedTaxIds: string[]
  selectedDiscountIds: string[]
  onUpdateTaxes: (taxIds: string[]) => void
  onUpdateDiscounts: (discountIds: string[]) => void
}

export default function OrderModifierModal({
  selectedTaxIds,
  selectedDiscountIds,
  onUpdateTaxes,
  onUpdateDiscounts
}: OrderModifierModalProps) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button variant="outlined" width="full">
          <Settings size={20} />
          <Box ml="2">Order Modifiers</Box>
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Order Modifiers</Modal.Title>
          <Modal.Description>
            Apply taxes and discounts to the entire order
          </Modal.Description>
        </Modal.Header>
        <VStack gap="4" py="4">
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