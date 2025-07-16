'use client'

import { memo, useCallback } from 'react'
import { Box, HStack, VStack } from '@styled-system/jsx'
import Paragraph from '@/components/ui/typography/paragraph'
import Heading from '@/components/ui/typography/heading'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartActions } from '@/contexts/CartContext'
import { cartItem } from '@styled-system/recipes'
import ModifierModal from '@/components/modals/ItemModal'
import { useCatalog } from '@/hooks/useCatalog'

interface Props {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  taxIds?: string[]
  discountIds?: string[]
}

const CartItem = memo(function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  taxIds = [],
  discountIds = []
}: Props) {
  const { updateQuantity } = useCartActions()
  const { taxes, discounts } = useCatalog()
  const { root, image, content, title, controls, button, deleteButton, contentWrapper, modifierInfo } = cartItem()

  const handleDecrease = useCallback(() => {
    updateQuantity(id, quantity - 1)
  }, [id, quantity, updateQuantity])

  const handleIncrease = useCallback(() => {
    updateQuantity(id, quantity + 1)
  }, [id, quantity, updateQuantity])

  const handleDelete = useCallback(() => {
    updateQuantity(id, 0)
  }, [id, updateQuantity])

  // Get selected tax and discount details
  const selectedTax = taxes.find(tax => tax.id === taxIds[0])
  const selectedDiscount = discounts.find(discount => discount.id === discountIds[0])

  return (
    <Box pb="1">
      <Box className={root}>
        {/* Delete Button */}
        <Box onClick={handleDelete} className={deleteButton}>
          <Trash2 size={20} />
        </Box>

        {/* Image */}
        <Box className={image}>
          <img
            src={imageUrl || '/placeholder-image.jpg'}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        {/* Content Wrapper */}
        <Box className={contentWrapper}>
          {/* Item Details */}
          <VStack className={content}>
            <Heading level={6}>{name}</Heading>
            <Paragraph size="sm" textStyle="bold">${price.toFixed(2)}</Paragraph>
            {/* Tax and Discount Info */}
            {(selectedTax || selectedDiscount) && (
              <Box className={modifierInfo}>
                {selectedTax && (
                  <Paragraph size="sm">Tax: {selectedTax.taxData.name} ({selectedTax.taxData.percentage}%)</Paragraph>
                )}
                {selectedDiscount && (
                  <Paragraph size="sm">
                    Discount: {selectedDiscount.discountData.name}
                    {selectedDiscount.discountData.percentage ? ` (${selectedDiscount.discountData.percentage}%)` : ''}
                  </Paragraph >
                )}
              </Box>
            )}
          </VStack>

          {/* Quantity Controls */}
          <HStack className={controls}>
            <ModifierModal 
              itemId={id} 
              selectedTaxIds={taxIds}
              selectedDiscountIds={discountIds}
            />
            <Box onClick={handleDecrease} className={button}>
              <Minus size={20} />
            </Box>
            <Paragraph>{quantity}</Paragraph>
            <Box onClick={handleIncrease} className={button}>
              <Plus size={20} />
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
})

export default CartItem
