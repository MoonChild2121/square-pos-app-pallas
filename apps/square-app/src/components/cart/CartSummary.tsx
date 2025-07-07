'use client'

import { VStack, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/ui/typography/heading'
import Paragraph from '@/components/ui/typography/paragraph'
import { Button } from '@/components/ui/button'

interface CartSummaryProps {
  subtotal: number
  tax: number
  total: number
  isDisabled?: boolean
  onSubmit?: () => void
}

export default function CartSummary({
  subtotal,
  tax,
  total,
  isDisabled = false,
  onSubmit,
}: CartSummaryProps) {
  return (
    <VStack
      gap="3"
      w="100%"
      pt="4"
      className={css({
        borderTop: '1px dashed',
        borderColor: 'gray.300',
      })}
    >
      <VStack gap="2" w="100%">
        <HStack justify="space-between" w="100%">
          <Paragraph>Subtotal</Paragraph>
          <Paragraph>${subtotal.toFixed(2)}</Paragraph>
        </HStack>
        <HStack justify="space-between" w="100%">
          <Paragraph>Tax (10%)</Paragraph>
          <Paragraph>${tax.toFixed(2)}</Paragraph>
        </HStack>
        <HStack
          justify="space-between"
          w="100%"
          pt="2"
          className={css({
            borderTop: '1px dashed',
            borderColor: 'gray.300',
          })}
        >
          <Heading level={4}>TOTAL</Heading>
          <Heading level={4}>${total.toFixed(2)}</Heading>
        </HStack>
      </VStack>

      <Button
        variant="primary"
        size="lg"
        className={css({ width: '100%' })}
        disabled={isDisabled}
        onClick={onSubmit}
      >
        Place Order
      </Button>
    </VStack>
  )
}
