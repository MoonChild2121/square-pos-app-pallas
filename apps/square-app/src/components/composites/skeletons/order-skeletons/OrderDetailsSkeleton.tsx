import { VStack, HStack, Box } from '@styled-system/jsx'
import { Skeleton } from '@/components/primitives/ui/skeleton'
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
      <Box className={pill({ variant: 'cart', colorScheme: 'success' })}>
        <Skeleton />
      </Box>

      {/* Tax pill */}
      <Box className={pill({ variant: 'cart', colorScheme: 'default' })}>
        <Skeleton />
      </Box>

      {/* Total */}
      <HStack
        justify="space-between"
      >
        <Skeleton css={{ width: '90px', height: '20px' }} />
      </HStack>
    </VStack>
  )
}