import { VStack, HStack } from '@styled-system/jsx'
import { Skeleton } from '@/components/ui/skeleton'
import { pill, skeleton } from '@styled-system/recipes'
import { css } from '@styled-system/css'

export function OrderDetailsSkeleton() {
  return (
    <VStack className={skeleton({ variant: 'orderDetails' })}>
      {/* Title */}
      <Skeleton css={{ width: '140px', height: '24px' }} />

      {/* Subtotal */}
      <HStack justify="space-between" w="100%">
        <Skeleton css={{ width: '64px', height: '16px' }} />
      </HStack>

      {/* Discount pill */}
      <HStack className={pill({ variant: 'discount' })}>
        <Skeleton css={{ width: '50px', height: '16px' }} />
      </HStack>

      {/* Tax pill */}
      <HStack className={pill({ variant: 'tax' })}>
        <Skeleton css={{ width: '50px', height: '16px' }} />
      </HStack>

      {/* Total */}
      <HStack
        justify="space-between"
        w="100%"
        pt="3"
        mt="2"
        className={css({
          borderTop: '1px solid',
          borderColor: 'surface.container.highest'
        })}
      >
        <Skeleton css={{ width: '90px', height: '20px' }} />
      </HStack>
    </VStack>
  )
}
