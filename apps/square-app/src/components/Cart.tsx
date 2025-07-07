'use client'

import { Box, Flex, HStack, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/ui/typography/heading'
import Paragraph from '@/components/ui/typography/paragraph'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'

export default function Cart() {
  const { state, updateQuantity, calculateTotal } = useCart()
  const { subtotal, tax, total } = calculateTotal()

  return (
    <Flex direction="column" h="100%" justify="space-between">
      {/* Cart Items Scrollable Area */}
      <VStack gap="3" w="100%" className={css({
        overflowY: 'auto',
        flex: '1',
        pr: '1',
      })}>
        {state.items.map((item) => (
          <Box
            key={`${item.id}-${item.selectedModifier?.id || 'no-modifier'}`}
            className={css({
              pb: '3',
            })}
          >
            <HStack
              justify="space-between"
              align="center"
              gap="4"
              className={css({
                bg: 'white',
                borderRadius: 'xl',
                p: '3',
              })}
            >
              {/* Image container with pill background */}
              <Box
                className={css({
                  bg: 'gray.50',
                  borderRadius: 'xl',
                  p: '2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '70px',
                  height: '70px',
                  flexShrink: 0,
                })}
              >
                <img
                  src={item.imageUrl || '/placeholder-image.jpg'}
                  alt={item.name}
                  className={css({
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  })}
                />
              </Box>

              {/* Name, price, and modifier */}
              <VStack
                align="flex-start"
                gap="1"
                className={css({
                  maxW: '140px',
                  w: '100%',
                  flexShrink: 0,
                  textOverflow: 'inherit',
                })}
              >
                <Heading level={5} className={css({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>
                  {item.name}
                </Heading>
                <Paragraph size="sm">
                  ${(item.price + (item.selectedModifier?.price || 0)).toFixed(2)}
                </Paragraph>
                {item.selectedModifier && (
                  <Paragraph className={css({ color: 'gray.600' })}>
                    {item.selectedModifier.name}
                  </Paragraph>
                )}
              </VStack>

              {/* Quantity controls */}
              <HStack
                className={css({
                  px: '2',
                  py: '1',
                  borderRadius: 'full',
                  bg: 'gray.100',
                  gap: '2',
                })}
              >
                <Box
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className={css({
                    color: 'white',
                    bg: 'primary',
                    borderRadius: 'full',
                    p: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  })}
                >
                  <Minus size={14} />
                </Box>
                <Paragraph size="sm">{item.quantity}</Paragraph>
                <Box
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className={css({
                    color: 'white',
                    bg: 'primary',
                    borderRadius: 'full',
                    p: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  })}
                >
                  <Plus size={14} />
                </Box>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Cart Summary & Action Buttons */}
      <VStack gap="3" w="100%" pt="4" className={css({ borderTop: '1px dashed', borderColor: 'gray.300' })}>
        <VStack gap="2" w="100%">
          <HStack justify="space-between" w="100%">
            <Paragraph>Subtotal</Paragraph>
            <Paragraph>${subtotal.toFixed(2)}</Paragraph>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Paragraph>Tax (10%)</Paragraph>
            <Paragraph>${tax.toFixed(2)}</Paragraph>
          </HStack>
          <HStack justify="space-between" w="100%" pt="2" className={css({ borderTop: '1px dashed', borderColor: 'gray.300' })}>
            <Heading level={4}>TOTAL</Heading>
            <Heading level={4}>${total.toFixed(2)}</Heading>
          </HStack>
        </VStack>

        <Button 
          variant="primary" 
          size="lg" 
          className={css({ width: '100%' })}
          disabled={state.items.length === 0}
        >
          Place Order
        </Button>
      </VStack>
    </Flex>
  )
}
