import { Box, VStack, HStack, Circle } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { css } from '@styled-system/css'
import Image from 'next/image'
import { cardBox } from '@styled-system/recipes'

interface OrderItemCardProps {
  item: {
    name: string
    variationName: string
    quantity: number
    catalogObjectId: string
    basePriceMoney: { amount: number }
    totalTaxMoney: { amount: number }
    totalDiscountMoney: { amount: number }
    totalMoney: { amount: number }
  }
  imageUrl?: string
}

const formatMoney = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

export const OrderItemCard = ({ item, imageUrl }: OrderItemCardProps) => (
  <HStack
    gap="4"
    className={cardBox({ variant: 'orderitemcard' })}
  >
    {/* Image */}
    {imageUrl ? (
      <Box position="relative" minW="80px" h="80px">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className={css({
            objectFit: 'cover',
            borderRadius: 'md',
          })}
        />
      </Box>
    ) : (
      <Circle size="80px" />
    )}

    {/* Item Details */}
    <VStack gap="1">
      <Heading level={4} className={css({ color: 'text.primary', fontSize: 'sm' })}>
        {item.name} - {item.variationName}
      </Heading>
      <HStack gap="2" >
        <Paragraph size="sm" className={css({ color: 'text.secondary' })}>
          Qty: {item.quantity}
        </Paragraph>
        <Paragraph size="sm" className={css({ color: 'text.secondary' })}>
          •
        </Paragraph>
        <Paragraph size="sm" className={css({ color: 'text.secondary' })}>
          {formatMoney(item.basePriceMoney.amount)} each
        </Paragraph>
      </HStack>
      {item.totalTaxMoney.amount > 0 && (
        <Paragraph size="compact" className={css({ color: 'text.tertiary' })}>
          Tax: {formatMoney(item.totalTaxMoney.amount)}
        </Paragraph>
      )}
      {item.totalDiscountMoney.amount > 0 && (
        <Paragraph size="compact" className={css({ color: 'error' })}>
          -{formatMoney(item.totalDiscountMoney.amount)}
        </Paragraph>
      )}
    </VStack>

    {/* Total */}
    <Box>
      <Heading level={4} className={css({ color: 'text.primary', fontSize: 'sm' })}>
        {formatMoney(item.totalMoney.amount)}
      </Heading>
    </Box>
  </HStack>
) 