import { Box, VStack, HStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/primitives/ui/typography'
import { css } from '@styled-system/css'
import Image from 'next/image'
import { orderCard } from '@styled-system/recipes'
import { formatMoney } from '@/shared/utils/helpers'
import { OrderItemCardProps } from '@/shared/types/orders'

export const OrderItemCard = ({ item, imageUrl }: OrderItemCardProps) => {

  return (
    <HStack className={orderCard()}>
      {/* Image */}
      <Box
        position="relative"
        w="64px"
        h="64px"
        className={css({
          flexShrink: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Image
          src={imageUrl?.trim() || '/placeholder-image.jpg'}
          alt={item.name}
          width={64}
          height={64}
          sizes="64px"
          priority={false}
          quality={75}
        />
      </Box>

      {/* Item Details */}
      <HStack justify="space-between" w="full">
        <VStack gap="0" align="start">
          <Heading level={6}>
            {item.name} - {item.variationName}
          </Heading>

          <HStack>
            <Paragraph size="compact">Qty: {item.quantity}</Paragraph>
            <Paragraph size="compact">•</Paragraph>
            <Paragraph size="compact">
              {formatMoney(item.basePriceMoney.amount)} each
            </Paragraph>
          </HStack>

          {item.modifiers?.map(mod => (
            <Paragraph size="compact" key={mod.name}>
              {mod.name}: +{formatMoney(mod.basePriceMoney.amount)}
            </Paragraph>
          ))}

          {item.totalTaxMoney.amount > 0 && (
            <Paragraph size="compact">
              Tax: {formatMoney(item.totalTaxMoney.amount)}
            </Paragraph>
          )}

          {item.totalDiscountMoney.amount > 0 && (
            <Paragraph size="compact">
              -{formatMoney(item.totalDiscountMoney.amount)}
            </Paragraph>
          )}
        </VStack>

        {/* Total */}
        <Box minW="fit-content">
          <Paragraph
           size="compact"
          >
            {formatMoney(item.totalMoney.amount)}
          </Paragraph>
        </Box>
      </HStack>
    </HStack>
  )
}
