'use client'

import { memo, useCallback } from 'react'
import { Box, HStack, VStack } from '@styled-system/jsx'
import Paragraph from '@/components/primitives/ui/typography/paragraph'
import Heading from '@/components/primitives/ui/typography/heading'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartActions } from '@/shared/contexts/CartContext'
import { cartItem } from '@styled-system/recipes'
import ModifierModal from '@/components/composites/modals/ItemModal'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { css } from '@styled-system/css'
import { CartItem } from '@/shared/types/cart/index'
import { formatMoney } from '@/shared/utils/helpers'

const CartItems = memo(function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  taxIds = [],
  discountIds = [],
  selectedModifier
}: CartItem) {
  const { updateQuantity } = useCartActions()
  const { taxes, discounts } = useCatalog()
  const { root, image, content, controls, button, deleteButton, contentWrapper, modifierInfo } = cartItem()

  const handleDecrease = useCallback(() => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1)
    } else {
      updateQuantity(id, 0) // This will remove the item
    }
  }, [id, quantity, updateQuantity])

  const handleIncrease = useCallback(() => {
    updateQuantity(id, quantity + 1)
  }, [id, quantity, updateQuantity])

  const handleDelete = useCallback(() => {
    updateQuantity(id, 0)
  }, [id, updateQuantity])

  // Get selected tax and discount details
  const selectedTax = taxes.find(tax => tax.uid === taxIds[0])
  const selectedDiscount = discounts.find(discount => discount.uid === discountIds[0])

  // Calculate total item price including modifier
  const totalItemPrice = price * quantity

  return (
    <Box pb="padding.block.sm">
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
          />
        </Box>

        {/* Content Wrapper */}
        <Box className={contentWrapper}>
          {/* Item Details */}
          <VStack className={content}>
            <Heading level={6}>
              {name}
              {selectedModifier && (
                <span className={css({ color: 'text.secondary', fontSize: 'sm' })}>
                  {' - '}{selectedModifier.name}
                </span>
              )}
            </Heading>
            <Paragraph size="compact" textStyle="bold">
              {formatMoney(totalItemPrice)}
              {selectedModifier && selectedModifier.price > 0 && (
                <span className={css({ color: 'text.secondary', fontSize: 'xs' })}>
                  {' '}(+{formatMoney(selectedModifier.price)} each)
                </span>
              )}
            </Paragraph>
            
            {/* Tax and Discount Info */}
            {(selectedTax || selectedDiscount) && (
              <Box className={modifierInfo}>
                {selectedTax && (
                  <Paragraph size="subscript">Tax: {selectedTax.name} ({selectedTax.percentage}%)</Paragraph>
                )}
                {selectedDiscount && (
                  <Paragraph size="subscript">
                    Discount: {selectedDiscount.name}
                    {selectedDiscount.percentage ? ` (${selectedDiscount.percentage}%)` : ''}
                  </Paragraph>
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
              <Minus size={17} />
            </Box>
            <Paragraph>{quantity}</Paragraph>
            <Box onClick={handleIncrease} className={button}>
              <Plus size={17} />
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
})

export default CartItems
