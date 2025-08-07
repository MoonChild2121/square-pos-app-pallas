'use client';

import { VStack, HStack, Box } from '@styled-system/jsx';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { css } from '@styled-system/css';

function CatalogSectionSkeleton() {
  return (
    <Box
      className={css({
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: 'layout.section.sm',
        minHeight: 0,
      })}
    >
      {/* Menu Section - match CatalogUI structure */}
      <VStack gap="layout.section.sm">
        {/* Menu Box Grid Skeleton */}
        <Box
          className={css({
            py: 'padding.block.md',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          })}
        >
          <HStack gap="layout.internal.sm" w="max-content">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={css({
                  width: '120px',
                  height: '80px',
                  borderRadius: '12px',
                  flexShrink: 0,
                })}
              />
            ))}
          </HStack>
        </Box>

        {/* Search Bar Skeleton */}
        <Box w="100%">
          <Skeleton
            className={css({
              width: '100%',
              height: '48px',
              borderRadius: '24px',
            })}
          />
        </Box>
      </VStack>

      {/* Product Section - match CatalogUI structure */}
      <Box
        className={css({
          flex: '1',
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        })}
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 'layout.internal.sm',
            w: '100%',
            py: 'padding.block.md',
          })}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <VStack key={i} align="start" gap="gap.inline.sm">
              <Skeleton
                className={css({
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                })}
              />
              <Skeleton
                className={css({
                  width: '80%',
                  height: '16px',
                  borderRadius: '4px',
                })}
              />
              <Skeleton
                className={css({
                  width: '60%',
                  height: '14px',
                  borderRadius: '4px',
                })}
              />
            </VStack>
          ))}
        </div>
      </Box>
    </Box>
  );
}

export { CatalogSectionSkeleton };
