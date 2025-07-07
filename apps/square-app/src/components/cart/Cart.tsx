'use client'

import { Box, Flex, HStack, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { useCart } from '@/contexts/CartContext'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function Cart() {
  const { state, calculateTotal } = useCart()
  const { subtotal, tax, total } = calculateTotal()

  return (
    <Flex direction="column" h="100%" justify="space-between">
      {/* Cart Items */}
      <VStack
        gap="3"
        w="100%"
        className={css({
          overflowY: 'auto',
          flex: '1',
          pr: '1',
        })}
      >
        {state.items.map((item) => (
          <CartItem
            key={`${item.id}-${item.selectedModifier?.id || 'no-modifier'}`}
            {...item}
          />
        ))}
      </VStack>

      {/* Summary */}
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        isDisabled={state.items.length === 0}
        onSubmit={() => {
          // Future: add order handling here
          console.log('Place order clicked')
        }}
      />
    </Flex>
  )
}
