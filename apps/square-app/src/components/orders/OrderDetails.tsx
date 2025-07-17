import { VStack, HStack, Box } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
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
      gap="gap.inline.md"
      className={css({
        p: 'padding.block.md',
        bg: 'surface.container',
        borderRadius: 'lg',
        boxShadow: 'md',
        ...(fullWidth ? {
          w: '100%',
        } : {
          minW: '320px',
          maxW: '360px',
        })
      })}
    >
      <Heading level={4}>Order Summary</Heading>
      <VStack gap="gap.inline.xs" w="100%">
        {/* Subtotal */}
        <HStack justify="space-between" w="100%">
          <Paragraph size="compact">Subtotal</Paragraph>
          <Paragraph size="compact">{formatMoney(subtotal)}</Paragraph>
        </HStack>

        {/* Discount pill */}
        {hasDiscount && (
          <Box className={pill({ variant: 'discount' })}>
            <Paragraph size="compact">Discount</Paragraph>
            <Paragraph size="compact">
              -{formatMoney(order.totalDiscountMoney.amount)}
            </Paragraph>
          </Box>
        )}

        {/* Tax pill */}
        {hasTax && (
          <Box className={pill({ variant: 'tax' })} mt={hasDiscount ? '2' : '1'}>
            <Paragraph size="compact">Sales Tax</Paragraph>
            <Paragraph size="compact">
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
            pt: 'padding.block.sm',
            mt: 'padding.block.sm',
          })}
        >
          <Heading level={5}>Total</Heading>
          <Heading level={5}>{formatMoney(order.totalMoney.amount)}</Heading>
        </HStack>
      </VStack>
    </VStack>
  )
}