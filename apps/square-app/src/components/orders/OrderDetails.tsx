import { VStack, HStack, Box } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { css } from '@styled-system/css'
import { pill } from '@styled-system/recipes'

interface OrderDetailsProps {
  order: {
    taxes?: Array<{
      uid: string
      name: string
      percentage: number
      appliedMoney: { amount: number }
    }>
    discounts?: Array<{
      uid: string
      name: string
      percentage: number
      appliedMoney: { amount: number }
    }>
    totalMoney: { amount: number }
    totalTaxMoney: { amount: number }
    totalDiscountMoney: { amount: number }
  }
}

const formatMoney = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const hasDiscount = order.totalDiscountMoney.amount > 0
  const hasTax = order.totalTaxMoney.amount > 0
  const subtotal =
    order.totalMoney.amount - order.totalTaxMoney.amount + order.totalDiscountMoney.amount

  return (
    <VStack
      gap="4"
      className={css({
        p: '4',
        bg: 'surface.container',
        borderRadius: 'lg',
        boxShadow: 'md',
        minW: '320px',
        maxW: '360px',
      })}
    >
      <Heading level={4}>Order Summary</Heading>
      <VStack gap="2" w="100%">
        {/* Subtotal */}
        <HStack justify="space-between" w="100%">
          <Paragraph size="sm">Subtotal</Paragraph>
          <Paragraph size="sm">{formatMoney(subtotal)}</Paragraph>
        </HStack>

        {/* Discount pill */}
        {hasDiscount && (
          <Box className={pill({ variant: 'discount' })}>
            <Paragraph size="sm">Discount</Paragraph>
            <Paragraph size="sm">
              -{formatMoney(order.totalDiscountMoney.amount)}
            </Paragraph>
          </Box>
        )}

        {/* Tax pill */}
        {hasTax && (
          <Box className={pill({ variant: 'tax' })} mt={hasDiscount ? '2' : '1'}>
            <Paragraph size="sm">Sales Tax</Paragraph>
            <Paragraph size="sm">
              {formatMoney(order.totalTaxMoney.amount)}
            </Paragraph>
          </Box>
        )}

        {/* Total */}
        <HStack
          justify="space-between"
          w="100%"
          className={css({
            borderTop: '1px solid',
            borderColor: 'surface.container.highest',
            pt: '3',
            mt: '2',
          })}
        >
          <Heading level={5}>Total</Heading>
          <Heading level={5}>{formatMoney(order.totalMoney.amount)}</Heading>
        </HStack>
      </VStack>
    </VStack>
  )
} 