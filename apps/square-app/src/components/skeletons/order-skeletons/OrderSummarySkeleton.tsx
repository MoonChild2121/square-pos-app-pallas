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
        <Skeleton className={skeleton({ variant: 'orderItem' })}  />
      </HStack>
      {/* Tax pill */}
      <HStack className={pill({ variant: 'tax' })}>
        <Skeleton className={skeleton({ variant: 'orderItem' })} />
      </HStack>

      {/* Total */}
      <HStack>
        <Skeleton className={skeleton({ variant: 'orderItem' })}/>
      </HStack>
    </VStack>
  )
} 