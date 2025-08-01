'use client';

import { memo, useState } from 'react';
import { Box, HStack, VStack } from '@styled-system/jsx';
import SelectModifier from '@/components/composites/modifierSelect/SelectModifier';
import { useCartStore } from '@/shared/stores/useCartStore';
import { Button } from '@/components/primitives/ui/button';
import { Minus, Plus } from 'lucide-react';
import Paragraph from '@/components/primitives/ui/typography/paragraph';
import Heading from '@/components/primitives/ui/typography/heading';
import { Product } from '@/shared/types/base';
import { formatMoney } from '@/shared/utils/helpers';
import Image from 'next/image';
import { itemCard } from '@styled-system/recipes';
import { css } from '@styled-system/css';

const ProductCard = memo(function ProductCard({
  id,
  name,
  price,
  imageUrl,
  taxIds,
  modifiers = [],
}: Product) {
  const addItem = useCartStore((state) => state.addItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const items = useCartStore((state) => state.items);

  // Find default modifier or first one
  const defaultModifier = modifiers.find((mod) => mod.onByDefault) || modifiers[0];
  const [selectedModifierId, setSelectedModifierId] = useState<string>(defaultModifier?.id || '');

  // Generate the composite ID to check if item is in cart
  const compositeId = selectedModifierId ? `${id}-${selectedModifierId}` : id;
  const cartItem = items.find((item) => item.id === compositeId);

  const handleAddToCart = () => {
    const modifier = modifiers.find((m) => m.id === selectedModifierId);
    const totalPrice = {
      amount: price.amount + (modifier?.priceMoney.amount || 0),
      currency: price.currency,
    };

    addItem({
      id,
      name,
      price: totalPrice.amount,
      quantity: 1,
      imageUrl,
      taxIds,
      selectedModifier: modifier
        ? {
            id: modifier.id,
            name: modifier.name,
            price: modifier.priceMoney.amount,
          }
        : undefined,
    });
  };

  return (
    <Box className={itemCard()}>
      <VStack gap="gap.inline.xs">
        <Box
          position="relative"
          className={css({
            borderRadius: 'xl',
            overflow: 'hidden',
            aspectRatio: '4/3',
            bg: 'surface.layout',
          })}
        >
          <Image
            src={imageUrl || '/placeholder-image.png'}
            alt={name}
            fill
            sizes="166px"
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Heading level={6}>{name}</Heading>

        <Paragraph
          size="compact"
          textStyle="bold"
          className={css({
            borderBottom: '1px solid',
            borderColor: 'fill',
          })}
        >
          {formatMoney(price.amount)}
        </Paragraph>

        {modifiers.length > 0 && (
          <SelectModifier
            modifiers={modifiers}
            value={selectedModifierId}
            onChange={setSelectedModifierId}
          />
        )}

        {cartItem ? (
          <HStack justify="space-between">
            <Button shape="circle" onClick={() => decreaseQuantity(compositeId)}>
              <Minus size={15} />
            </Button>
            <Box>{cartItem.quantity}</Box>
            <Button shape="circle" onClick={() => increaseQuantity(compositeId)}>
              <Plus size={15} />
            </Button>
          </HStack>
        ) : (
          <Button onClick={handleAddToCart} width="full">
            Add to Cart
          </Button>
        )}
      </VStack>
    </Box>
  );
});

export default ProductCard;
