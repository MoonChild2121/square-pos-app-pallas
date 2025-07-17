'use client'

import { memo, useMemo, useState } from 'react'
import { Box, HStack } from '@styled-system/jsx'
import { productCard } from '@styled-system/recipes'
import { ModifierData } from '@/types/modifiers'
import SelectModifier from '@/components/common/SelectModifier'
import { useCartActions, useCartState } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { css } from '@styled-system/css'

interface ProductCardProps {
  id: string
  name: string
  price: {
    amount: number;
    currency: string;
  }
  imageUrl?: string
  taxIds?: string[]
  modifiers?: ModifierData[]
}

const ProductCard = memo(function ProductCard({ 
  id,
  name, 
  price, 
  imageUrl,
  taxIds,
  modifiers = []
}: ProductCardProps) {
  const styles = useMemo(() => productCard(), [])
  const { addItem, updateQuantity } = useCartActions()
  const { items } = useCartState()
  
  // Find default modifier or first one
  const defaultModifier = modifiers.find(mod => mod.onByDefault) || modifiers[0]
  const [selectedModifierId, setSelectedModifierId] = useState<string>(defaultModifier?.id || '')

  // Generate the composite ID to check if item is in cart
  const compositeId = selectedModifierId ? `${id}-${selectedModifierId}` : id
  const cartItem = items.find(item => item.id === compositeId)

  const handleAddToCart = () => {
    const modifier = modifiers.find(m => m.id === selectedModifierId)
    const totalPrice = {
      amount: price.amount + (modifier?.priceMoney.amount || 0),
      currency: price.currency
    }

    addItem({
      id,
      name,
      price: totalPrice.amount / 100,
      quantity: 1,
      imageUrl,
      taxIds,
      selectedModifier: modifier ? {
        id: modifier.id,
        name: modifier.name,
        price: modifier.priceMoney.amount / 100
      } : undefined
    })
  }

  const handleIncrease = () => {
    if (cartItem) {
      updateQuantity(compositeId, cartItem.quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (cartItem && cartItem.quantity > 0) {
      updateQuantity(compositeId, cartItem.quantity - 1)
    }
  }
  
  return (
    <Box className={styles.root}>
      <Box className={styles.image}>
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box className={styles.nameContainer}>  
        <Box className={styles.name}>{name}</Box>
        <Box className={styles.price}>${(price.amount / 100).toFixed(2)}</Box>
        {modifiers && modifiers.length > 0 && (
        <Box p="2">
          <SelectModifier
            modifiers={modifiers}
            value={selectedModifierId}
            onChange={setSelectedModifierId}
          />
        </Box>
      )}
      <Box p="2">
        {cartItem ? (
        <HStack 
          justify="space-between" 
          align="center"
          className={css({
            borderRadius: 'full',
            bg: 'fill.secondary',
          })}
        >
          <Button
            shape="circle"
            onClick={handleDecrease}
          >
            <Minus size={15} />
          </Button>
          <Box>{cartItem.quantity}</Box>
          <Button
            shape="circle"
            onClick={handleIncrease}
          >
            <Plus size={15} />
          </Button>
          
        </HStack>

        ) : (
          <Button onClick={handleAddToCart} width="full">
            Add to Cart
          </Button>
        )}
      </Box>
      </Box>
    </Box>
  )
})

export default ProductCard
