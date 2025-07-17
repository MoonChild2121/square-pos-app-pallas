import { VStack, HStack } from '@styled-system/jsx'
import { Skeleton } from '@/components/ui/skeleton'
import { pill, skeleton } from '@styled-system/recipes'
import { css } from '@styled-system/css'

export function OrderDetailsSkeleton() {
  return (
    <VStack className={skeleton({ variant: 'orderDetails' })}>
      {/* Title */}
      <Skeleton />

      {/* Subtotal */}
      <HStack justify="space-between" w="100%">
        <Skeleton />
      </HStack>

      {/* Discount pill */}
      <HStack className={pill({ variant: 'discount' })}>
        <Skeleton />
      </HStack>

      {/* Tax pill */}
      <HStack className={pill({ variant: 'tax' })}>
        <Skeleton/>
      </HStack>

      {/* Total */}
      <HStack
        justify="space-between"
      >
        <Skeleton css={{ width: '90px', height: '20px' }} />
      </HStack>
    </VStack>
  )
}
