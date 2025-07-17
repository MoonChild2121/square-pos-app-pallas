'use client'
 
import { Button } from '@/components/ui/button'
import Modal from '@/components/ui/modal/modal'
import { useState } from 'react'
import { useCartActions } from '@/contexts/CartContext'
import ModifierRadioGroup from '@/components/common/RadioGroup'
import { ModifierData } from '@/types/modifiers'

interface ModifierModalProps {
  product: {
    id: string;
    name: string;
    price: {
      amount: number;
      currency: string;
    };
    imageUrl?: string;
    taxIds?: string[];
    modifiers?: ModifierData[];
  };
  trigger?: React.ReactNode;
}

export default function ModifierModal({ product, trigger }: ModifierModalProps) {
  const [open, setOpen] = useState(false)
  const { addItem } = useCartActions()
  const modifierOptions = product.modifiers?.map(mod => ({
    id: mod.id,
    label: mod.name,
    price: mod.priceMoney.amount / 100,
    onByDefault: mod.onByDefault
  })) || []

  // Find default modifier or first one
  const defaultModifier = modifierOptions.find(mod => mod.onByDefault) || modifierOptions[0]
  const [selectedModifier, setSelectedModifier] = useState<string>(defaultModifier?.id || '')

  const handleAddToCart = () => {
    const modifier = product.modifiers?.find(m => m.id === selectedModifier)
    const totalPrice = {
      amount: product.price.amount + (modifier?.priceMoney.amount || 0),
      currency: product.price.currency
    }

    // Add item with base product ID and modifier info
    addItem({
      id: product.id, // Keep the base product ID
      name: product.name,
      price: totalPrice.amount / 100,
      quantity: 1,
      imageUrl: product.imageUrl,
      taxIds: product.taxIds,
      selectedModifier: modifier ? {
        id: modifier.id,
        name: modifier.name,
        price: modifier.priceMoney.amount / 100
      } : undefined
    })
    setOpen(false)
  }

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        {trigger || <Button>Select Options</Button>}
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Select Options for {product.name}</Modal.Title>
          <Modal.Description>Please choose your preferences.</Modal.Description>
        </Modal.Header>
        {modifierOptions.length > 0 && (
          <ModifierRadioGroup
            options={modifierOptions}
            value={selectedModifier}
            onChange={setSelectedModifier}
            groupId={product.id}
          />
        )}
        <Modal.Footer>
          <Modal.Cancel>Cancel</Modal.Cancel>
          <Modal.Action asChild>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </Modal.Action>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}