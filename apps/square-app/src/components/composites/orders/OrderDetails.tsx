import { VStack, HStack, Box } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/primitives/ui/typography'
import { css } from '@styled-system/css'
import { pill } from '@styled-system/recipes'
import { OrderDetailsProps } from '@/shared/types/orders'
import { formatMoney } from '@/shared/utils/helpers'

export const OrderDetails = ({ order, fullWidth = false }: OrderDetailsProps) => {
  const hasDiscount = order.totalDiscountMoney.amount > 0
  const hasTax = order.totalTaxMoney.amount > 0
  const subtotal =
    order.totalMoney.amount - order.totalTaxMoney.amount + order.totalDiscountMoney.amount

  return (
    <VStack
      className={css({
        p: 'padding.block.md',
        bg: 'surface.container',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'border',
        boxShadow: 'sm',
        ...(fullWidth ? {
          w: '100%',
        } : {
          minW: '320px',
          maxW: '360px',
        })
      })}
    >
      <Heading level={4}>Order Summary</Heading>
      <VStack w="100%">
        {/* Subtotal */}
        <HStack justify="space-between" w="100%"  p='0'>
          <Paragraph size="compact">Subtotal</Paragraph>
          <Paragraph size="compact">{formatMoney(subtotal)}</Paragraph>
        </HStack>

        {(hasDiscount || hasTax) && (
        <Box>
          {/* Discount pill */}
          {hasDiscount && (
            <Box className={pill({ variant: 'cart', colorScheme: 'success' })}>
              <Paragraph size="compact">Discount</Paragraph>
              <Paragraph size="compact">
                -{formatMoney(order.totalDiscountMoney.amount)}
              </Paragraph>
            </Box>
          )}

          {/* Tax pill */}
          {hasTax && (
            <Box
              className={pill({ variant: 'cart', colorScheme: 'default' })}
              mt={hasDiscount ? '2' : '1'}
            >
              <Paragraph size="compact">Tax</Paragraph>
              <Paragraph size="compact">
                {formatMoney(order.totalTaxMoney.amount)}
              </Paragraph>
            </Box>
          )}
        </Box>
      )}


        {/* Total */}
        <HStack
          justify="space-between"
          w="100%"
          className={css({
            borderTop: '1px solid',
            borderColor: 'surface.spotlight',
            pt: 'padding.block.md'
          })}
        >
          <Heading level={5}>Total</Heading>
          <Heading level={5}>{formatMoney(order.totalMoney.amount)}</Heading>
        </HStack>
      </VStack>
    </VStack>
  )
}