import { VStack, HStack } from '@styled-system/jsx'
import { pill, skeleton } from '@styled-system/recipes'
import { Skeleton } from '@/components/ui/skeleton'
import { css } from '@styled-system/css'
import { Heading } from '@/components/ui/typography'

export function OrderSummarySkeleton() {
  return (
    <VStack className={skeleton({ variant: 'orderSummary' })}>
      {/* Title */}
      <Heading level={4}>Order Summary</Heading>
      {/* Subtotal */}
      <HStack justify="space-between" w="100%">
        <Skeleton className={skeleton({ variant: 'orderItem' })}  css={{ width: '64px', height: '16px' }} />
      </HStack>
      {/* Tax pill */}
      <HStack className={pill({ variant: 'tax' })}>
        <Skeleton className={skeleton({ variant: 'orderItem' })} css={{ width: '50px', height: '16px',  }} />
      </HStack>

      {/* Total */}
      <HStack
        justify="space-between"
        w="100%"
        pt="2"
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