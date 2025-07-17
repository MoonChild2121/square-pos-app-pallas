'use client'

import { memo, useMemo, useState } from 'react'
import { Box } from '@styled-system/jsx'
import { productCard } from '@styled-system/recipes'
import SelectModifier from '@/components/select/SelectModifier'
import { useCartActions, useCartState } from '@/shared/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import Paragraph from '../ui/typography/paragraph'
import Heading from '@/components/ui/typography/heading'
import { Product } from '@/shared/types/product'

const ProductCard = memo(function ProductCard({ 
  id,
  name, 
  price, 
  imageUrl,
  taxIds,
  modifiers = []
}: Product) {
  const styles = useMemo(() => productCard({ hasModifiers: modifiers.length > 0 }), [modifiers.length])
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
        />
      </Box>
      
      <Box className={styles.nameContainer}>  
        <Box className={styles.name}>
          <Heading level={6}>{name}</Heading>
        </Box>
        
        <Box className={styles.price}>
          <Paragraph size="compact" textStyle="bold">
            ${(price.amount / 100).toFixed(2)}
          </Paragraph>
        </Box>
        
        {modifiers && modifiers.length > 0 && (
          <Box className={styles.modifierContainer}>
            <SelectModifier
              modifiers={modifiers}
              value={selectedModifierId}
              onChange={setSelectedModifierId} 
            />
          </Box>
        )}
        
        <Box className={styles.controlsContainer}>
          {cartItem ? (
            <Box className={styles.quantityControls}>
              <Button
                shape="circle"
                onClick={handleDecrease}
              >
                <Minus size={15} />
              </Button>
              
              <Box className={styles.quantityDisplay}>
                {cartItem.quantity}
              </Box>
              
              <Button
                shape="circle"
                onClick={handleIncrease}
              >
                <Plus size={15} />
              </Button>
            </Box>
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