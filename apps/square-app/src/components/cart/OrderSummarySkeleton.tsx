import { Box, VStack, HStack } from '@styled-system/jsx'
import { Skeleton } from '@/components/ui/skeleton'
import { css } from '@styled-system/css'

export function OrderSummarySkeleton() {
  return (
    <VStack gap="4" w="100%" className={css({
      p: '4',
      bg: 'surface.container',
      borderRadius: 'lg',
      boxShadow: 'md',
    })}>
      {/* Title */}
      <Skeleton css={{ width: '120px', height: '24px' }} />

      {/* Subtotal row */}
      <HStack justify="space-between" w="100%">
        <Skeleton css={{ width: '80px', height: '16px' }} />
        <Skeleton css={{ width: '64px', height: '16px' }} />
      </HStack>

      {/* Tax row */}
      <HStack justify="space-between" w="100%">
        <Skeleton css={{ width: '96px', height: '16px' }} />
        <Skeleton css={{ width: '64px', height: '16px' }} />
      </HStack>

      {/* Divider */}
      <Box h="1px" w="100%" bg="surface.container.highest" />

      {/* Total row */}
      <HStack justify="space-between" w="100%">
        <Skeleton css={{ width: '96px', height: '24px' }} />
        <Skeleton css={{ width: '80px', height: '24px' }} />
      </HStack>
    </VStack>
  )
} 