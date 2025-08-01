'use client';

import { memo, useCallback } from 'react';
import { Box, HStack, VStack } from '@styled-system/jsx';
import Paragraph from '@/components/primitives/ui/typography/paragraph';
import Heading from '@/components/primitives/ui/typography/heading';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/shared/stores/useCartStore';
import { cartItem } from '@styled-system/recipes';
import ModifierModal from '@/components/composites/orderModals/ItemModal';
import { useCatalog } from '@/shared/hooks/useCatalog';
import { css } from '@styled-system/css';
import { CartItem } from '@/shared/types/cart';
import { formatMoney } from '@/shared/utils/helpers';
import Image from 'next/image';

const CartItems = memo(function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  taxIds = [],
  discountIds = [],
  selectedModifier,
}: CartItem) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
  const { taxes, discounts } = useCatalog();
  const { root, image, content, controls, button, deleteButton } = cartItem();

  const handleDelete = useCallback(() => {
    removeItem(id);
  }, [id, removeItem]);

  const selectedTax = taxes.find((tax) => tax.uid === taxIds[0]);
  const selectedDiscount = discounts.find((discount) => discount.uid === discountIds[0]);
  const totalItemPrice = price * quantity;

  return (
    <Box pb="padding.block.sm">
      <HStack className={root}>
        {/* Delete Button */}
        <Box onClick={handleDelete} className={deleteButton}>
          <Trash2 size={20} />
        </Box>

        {/* Image */}
        <Box className={image}>
          <Image
            src={imageUrl || '/placeholder-image.png'}
            alt={name}
            fill
            sizes="80px"
            priority
            quality={75}
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {/* Content Wrapper */}
        <VStack justify="space-between" gap="gap.inline.xs" className={css({ flex: 1 })}>
          {/* Item Details */}
          <VStack className={content} gap="0">
            <Heading level={6}>
              {name}
              {selectedModifier && (
                <span className={css({ color: 'text.secondary', fontSize: 'sm' })}>
                  {' - '}
                  {selectedModifier.name}
                </span>
              )}
            </Heading>
            <Paragraph size="compact" textStyle="bold">
              {formatMoney(totalItemPrice)}
              {selectedModifier && selectedModifier.price > 0 && (
                <span className={css({ color: 'text.secondary', fontSize: 'xs' })}>
                  {' '}
                  (+{formatMoney(selectedModifier.price)} each)
                </span>
              )}
            </Paragraph>

            {(selectedTax || selectedDiscount) && (
              <VStack gap="0">
                {selectedTax && (
                  <Paragraph size="subscript" color="secondary">
                    Tax: {selectedTax.name} ({selectedTax.percentage}%)
                  </Paragraph>
                )}
                {selectedDiscount && (
                  <Paragraph size="subscript" color="secondary">
                    Discount: {selectedDiscount.name}
                    {selectedDiscount.percentage ? ` (${selectedDiscount.percentage}%)` : ''}
                  </Paragraph>
                )}
              </VStack>
            )}
          </VStack>

          {/* Quantity Controls */}
          <HStack className={controls}>
            <ModifierModal itemId={id} selectedTaxIds={taxIds} selectedDiscountIds={discountIds} />
            <Box onClick={() => decreaseQuantity(id)} className={button}>
              <Minus size={17} />
            </Box>
            <Paragraph>{quantity}</Paragraph>
            <Box onClick={() => increaseQuantity(id)} className={button}>
              <Plus size={17} />
            </Box>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
});

export default CartItems;
