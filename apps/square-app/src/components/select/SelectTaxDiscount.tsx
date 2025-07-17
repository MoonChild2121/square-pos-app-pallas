'use client'
 
import Select from '@/components/ui/select'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { useCartActions } from '@/shared/contexts/CartContext'
import { Box } from '@styled-system/jsx'
import Heading from '@/components/ui/typography/heading'

interface TaxSelectProps {
  itemId: string
  selectedTaxIds: string[]
  isOrderLevel?: boolean
}

interface DiscountSelectProps {
  itemId: string
  selectedDiscountIds: string[]
  isOrderLevel?: boolean
}

export function TaxSelect({ itemId, selectedTaxIds = [], isOrderLevel = false }: TaxSelectProps) {
  const { taxes } = useCatalog()
  const { updateItemTaxes, updateOrderTaxes } = useCartActions()

  const handleTaxChange = (value: string) => {
    if (isOrderLevel) {
      updateOrderTaxes(value === 'none' ? [] : [value])
    } else {
      updateItemTaxes(itemId, value === 'none' ? [] : [value])
    }
  }

  return (
    <Box>
      <Heading level={6} className="mb-2">Applicable Taxes</Heading>
      <Select.Root value={selectedTaxIds?.[0] || 'none'} onValueChange={handleTaxChange}>
        <Select.Trigger style={{ width: '100%' }}>
          <Select.Value placeholder="Select taxes" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="none">None</Select.Item>
            {taxes.map((tax) => (
              <Select.Item key={tax.id} value={tax.id}>
                {tax.taxData.name} ({tax.taxData.percentage}%)
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Box>
  )
}

export function DiscountSelect({ itemId, selectedDiscountIds = [], isOrderLevel = false }: DiscountSelectProps) {
  const { discounts } = useCatalog()
  const { updateItemDiscounts, updateOrderDiscounts } = useCartActions()

  const handleDiscountChange = (value: string) => {
    if (isOrderLevel) {
      updateOrderDiscounts(value === 'none' ? [] : [value])
    } else {
      updateItemDiscounts(itemId, value === 'none' ? [] : [value])
    }
  }

  return (
    <Box>
      <Heading level={6} className="mb-2">Available Discounts</Heading>
      <Select.Root value={selectedDiscountIds?.[0] || 'none'} onValueChange={handleDiscountChange}>
        <Select.Trigger style={{ width: '100%' }}>
          <Select.Value placeholder="Select discounts" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="none">None</Select.Item>
            {discounts.map((discount) => (
              <Select.Item key={discount.id} value={discount.id}>
                {discount.discountData.name} 
                {discount.discountData.percentage ? ` (${discount.discountData.percentage}%)` : ''}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Box>
  )
}