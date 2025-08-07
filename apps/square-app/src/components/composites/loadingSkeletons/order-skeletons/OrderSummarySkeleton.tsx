import { VStack, HStack } from '@styled-system/jsx';
import { skeleton } from '@styled-system/recipes';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { Heading } from '@/components/primitives/ui/typography';

export function OrderSummarySkeleton() {
  return (
    <VStack className={skeleton({ variant: 'orderSummary' })}>
      {/* Discount pill */}
      <Skeleton
        css={{ height: '20px' }} // or whatever height your pills typically are
      />

      {/* Tax pill skeleton */}
      <Skeleton css={{ height: '40px' }} />

      {/* Total */}
      <HStack>
        <Skeleton className={skeleton({ variant: 'orderItem' })} />
      </HStack>
    </VStack>
  );
}
