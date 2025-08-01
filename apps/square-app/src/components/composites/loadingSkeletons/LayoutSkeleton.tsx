import { VStack, HStack } from '@styled-system/jsx';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { css } from '@styled-system/css';

export function LayoutSkeleton() {
  return (
    <VStack gap="gap.inline.lg" w="100%" h="100vh" p="padding.inline.lg">
      {/* Header */}
      <HStack w="100%" h="56px" align="center" gap="gap.inline.md">
        <Skeleton
          className={css({
            width: '200px',
            height: '40px',
            borderRadius: '8px',
            bg: 'fill.secondary',
          })}
        />
      </HStack>

      {/* Horizontal Category Grid */}
      <HStack
        w="100%"
        gap="gap.inline.md"
        className={css({
          overflow: 'hidden',
        })}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={css({ width: '120px', height: '80px', borderRadius: '12px', flexShrink: 0 })}
          />
        ))}
      </HStack>

      {/* Search Bar */}
      <HStack w="100%" justify="center">
        <Skeleton
          className={css({
            width: '400px',
            height: '48px',
            borderRadius: '24px',
            bg: 'fill.secondary',
          })}
        />
      </HStack>

      {/* Product Grid */}
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'gap.inline.lg',
          w: '100%',
          flex: 1,
          overflow: 'auto',
        })}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <VStack key={i} align="start">
            <Skeleton
              className={css({
                width: '100%',
                height: '160px',
                borderRadius: '12px',
                bg: 'fill.secondary',
              })}
            />
          </VStack>
        ))}
      </div>
    </VStack>
  );
}

export default LayoutSkeleton;
