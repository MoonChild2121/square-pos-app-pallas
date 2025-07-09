'use client'

import { Box, Flex, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { useCart } from '@/contexts/CartContext'
import CartItem from './CartItem'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const { state } = useCart()
  const router = useRouter()

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
            key={item.id}
            {...item}
          />
        ))}
      </VStack>

      {/* Checkout Button */}
      <Box pt="4">
        <Button 
          width="full" 
          disabled={state.items.length === 0}
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Flex>
  )
}
