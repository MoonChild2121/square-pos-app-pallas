'use client'

import { Box, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Modal from '@/components/ui/modal/modal'
import { Button } from '@/components/ui/button'
import Paragraph from '@/components/ui/typography/paragraph'
import { useState } from 'react'

interface Modifier {
  id: string
  name: string
  price: number
}

interface ModifierModalProps {
  isOpen: boolean
  onClose: () => void
  modifiers: Modifier[]
  onSelect: (modifier: Modifier) => void
  productName: string
}

export default function ModifierModal({
  isOpen,
  onClose,
  modifiers,
  onSelect,
  productName,
}: ModifierModalProps) {
  const [selectedModifier, setSelectedModifier] = useState<Modifier | null>(null)

  const handleSelect = () => {
    if (selectedModifier) {
      onSelect(selectedModifier)
      onClose()
    }
  }

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Select Option for {productName}</Modal.Title>
          <Modal.Description>Choose a modifier for your item</Modal.Description>
        </Modal.Header>

        <VStack gap="2" w="100%">
          {modifiers.map((modifier) => (
            <Box
              key={modifier.id}
              onClick={() => setSelectedModifier(modifier)}
              className={css({
                p: '3',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: selectedModifier?.id === modifier.id ? 'primary' : 'gray.200',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                _hover: {
                  bg: 'gray.50',
                },
              })}
            >
              <Paragraph>{modifier.name}</Paragraph>
              <Paragraph>${modifier.price.toFixed(2)}</Paragraph>
            </Box>
          ))}
        </VStack>

        <Modal.Footer>
          <Modal.Cancel>Cancel</Modal.Cancel>
          <Modal.Action asChild>
            <Button
              variant="primary"
              onClick={handleSelect}
              disabled={!selectedModifier}
            >
              Add to Cart
            </Button>
          </Modal.Action>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
} 