'use client';

import { memo, useState, lazy, Suspense } from 'react';
import { Box, HStack, VStack } from '@styled-system/jsx';
import { useCartStore } from '@/shared/stores/useCartStore';
import { Button } from '@/components/primitives/ui/button';
import Paragraph from '@/components/primitives/ui/typography/paragraph';
import { Product } from '@/shared/types/base';
import { formatMoney } from '@/shared/utils/helpers';
import Image from 'next/image';
import { itemCard } from '@styled-system/recipes';
import { css } from '@styled-system/css';

// Lazy-loaded parts
const SelectModifier = lazy(() => import('@/components/composites/modifierSelect/SelectModifier'));
const MinusIcon = lazy(() =>
  import('lucide-react/dist/esm/icons/minus').then((m) => ({ default: m.default }))
);
const PlusIcon = lazy(() =>
  import('lucide-react/dist/esm/icons/plus').then((m) => ({ default: m.default }))
);

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

  const defaultModifier = modifiers.find((mod) => mod.onByDefault) || modifiers[0];
  const [selectedModifierId, setSelectedModifierId] = useState<string>(defaultModifier?.id || '');

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
        {/* Product Image */}
        <Box
          position="relative"
          className={css({
            borderRadius: 'xl',
            overflow: 'hidden',
            aspectRatio: '3/3',
            bg: 'surface.layout',
          })}
        >
          <Image
            src={imageUrl || '/placeholder-image.png'}
            alt={name}
            width={166}
            height={166}
            sizes="(max-width: 166px) 50vw, 166px"
            style={{ objectFit: 'contain' }}
            priority
            unoptimized={false}
          />
        </Box>

        {/* Product Name */}
        <Paragraph
          size="compact"
          textStyle="bold"
          className={css({
            fontSize: 'md',
            fontWeight: 'semibold',
            lineHeight: 'tight',
          })}
        >
          {name}
        </Paragraph>

        {/* Product Price */}
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

        {/* Lazy-loaded Modifier Selector */}
        {modifiers.length > 0 && (
          <Suspense fallback={null}>
            <SelectModifier
              modifiers={modifiers}
              value={selectedModifierId}
              onChange={setSelectedModifierId}
            />
          </Suspense>
        )}

        {/* Cart Controls */}
        {cartItem ? (
          <HStack justify="space-between">
            <Button
              onClick={() => decreaseQuantity(compositeId)}
              aria-label={`Decrease quantity of ${name}`}
            >
              <Suspense fallback={null}>
                <MinusIcon size={15} />
              </Suspense>
            </Button>
            <Box aria-label={`Current quantity: ${cartItem.quantity}`}>{cartItem.quantity}</Box>
            <Button
              onClick={() => increaseQuantity(compositeId)}
              aria-label={`Increase quantity of ${name}`}
            >
              <Suspense fallback={null}>
                <PlusIcon size={15} />
              </Suspense>
            </Button>
          </HStack>
        ) : (
          <Button onClick={handleAddToCart} width="full" aria-label={`Add ${name} to cart`}>
            Add to Cart
          </Button>
        )}
      </VStack>
    </Box>
  );
});

export default ProductCard;
