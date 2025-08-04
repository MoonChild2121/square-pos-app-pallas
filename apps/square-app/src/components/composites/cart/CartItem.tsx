'use client';

import { memo, useCallback } from 'react';
import { Box, HStack, VStack } from '@styled-system/jsx';
import Paragraph from '@/components/primitives/ui/typography/paragraph';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/shared/stores/useCartStore';
import { cartItem } from '@styled-system/recipes';
import ModifierModal from '@/components/composites/orderModals/ItemModal';
import { useCatalog } from '@/shared/hooks/useCatalog';
import { css } from '@styled-system/css';
import { CartItem } from '@/shared/types/cart';
import { formatMoney } from '@/shared/utils/helpers';
import Image from 'next/image';
import { Button } from '@/components/primitives/ui/button';

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
        <Button
          variant="text"
          size="sm"
          onClick={handleDelete}
          className={deleteButton}
          aria-label="Remove item from cart"
        >
          <Trash2 size={20} />
        </Button>

        {/* Image */}
        <Box className={image}>
          <Image
            src={imageUrl || '/placeholder-image.png'}
            alt={name}
            width={80}
            height={80}
            sizes="(max-width: 80px) 50vw, 80px"
            quality={75}
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
            }}
          />
        </Box>

        {/* Content Wrapper */}
        <VStack justify="space-between" gap="gap.inline.xs" className={css({ flex: 1 })}>
          {/* Item Details */}
          <VStack className={content} gap="0">
            <Paragraph size="compact" textStyle="bold">
              {name}
              {selectedModifier && (
                <span className={css({ color: 'text.secondary', fontSize: 'sm' })}>
                  {' - '}
                  {selectedModifier.name}
                </span>
              )}
            </Paragraph>
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
            <Button
              variant="primary"
              size="sm"
              shape="circle"
              onClick={() => decreaseQuantity(id)}
              aria-label="Decrease quantity"
            >
              <Minus size={17} />
            </Button>
            <Paragraph>{quantity}</Paragraph>
            <Button
              variant="primary"
              size="sm"
              shape="circle"
              onClick={() => increaseQuantity(id)}
              aria-label="Increase quantity"
            >
              <Plus size={17} />
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
});

export default CartItems;
