import { Box, VStack, HStack, Circle } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { css } from '@styled-system/css'
import Image from 'next/image'
import { orderItemCard } from '@styled-system/recipes'
import { formatMoney } from '@/shared/utils/helpers'
import { OrderItemCardProps } from '@/shared/types/orders'

export const OrderItemCard = ({ item, imageUrl }: OrderItemCardProps) => {
  const styles = orderItemCard()

  return (
    <HStack className={styles.root}>
      {/* Image */}
      {imageUrl ? (
        <Box className={styles.image}>
          <Image src={imageUrl} alt={item.name} fill />
        </Box>
      ) : (
        <Circle size="80px" className={styles.image} />
      )}

      {/* Item Details */}
      <VStack className={styles.content}>
        <Heading level={5} >
          {item.name} - {item.variationName}
        </Heading>

        <HStack gap="gap.inline.sm">
          <Paragraph size="compact">
            Qty: {item.quantity}
          </Paragraph>
          <Paragraph size="compact">
            •
          </Paragraph>
          <Paragraph size="compact">
            {formatMoney(item.basePriceMoney.amount)} each
          </Paragraph>
        </HStack>

        {item.totalTaxMoney.amount > 0 && (
          <Paragraph size="compact" >
            Tax: {formatMoney(item.totalTaxMoney.amount)}
          </Paragraph>
        )}
        {item.totalDiscountMoney.amount > 0 && (
          <Paragraph size="compact">
            -{formatMoney(item.totalDiscountMoney.amount)}
          </Paragraph>
        )}
      </VStack>

      {/* Total Price */}
      <Box className={styles.total}>
        <Heading level={4} className={css({ color: 'text.primary', fontSize: 'sm' })}>
          {formatMoney(item.totalMoney.amount)}
        </Heading>
      </Box>
    </HStack>
  )
}
