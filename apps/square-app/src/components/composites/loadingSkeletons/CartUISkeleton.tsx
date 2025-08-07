'use client';

import { VStack, Flex, Box } from '@styled-system/jsx';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { css } from '@styled-system/css';

export function CartUISkeleton() {
  return (
    <Box
      className={css({
        position: 'absolute',
        top: '0',
        right: '0',
        height: '100%',
        width: { base: '100%', md: '400px', lg: '450px' },
        bg: 'surface.container',
        borderLeft: '1px solid',
        borderColor: 'border.default',
        zIndex: 'overlay',
        padding: 'lg',
        gap: 'lg',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <VStack gap="md" align="start">
        <Skeleton
          className={css({
            height: '40px',
            width: '60%',
            borderRadius: '8px',
          })}
        />
        <Skeleton
          className={css({
            height: '20px',
            width: '40%',
            borderRadius: '4px',
          })}
        />
      </VStack>

      <Box className={css({ flex: '1' })}>
        <VStack gap="sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <Flex
              key={i}
              gap="sm"
              className={css({
                width: '100%',
                padding: 'sm',
                bg: 'surface.subtle',
                borderRadius: 'md',
              })}
            >
              <Skeleton
                className={css({
                  height: '60px',
                  width: '60px',
                  borderRadius: 'md',
                  flexShrink: 0,
                })}
              />
              <VStack gap="xs" align="start" className={css({ flex: '1' })}>
                <Skeleton
                  className={css({
                    height: '16px',
                    width: '80%',
                    borderRadius: '4px',
                  })}
                />
                <Skeleton
                  className={css({
                    height: '14px',
                    width: '40%',
                    borderRadius: '4px',
                  })}
                />
                <Skeleton
                  className={css({
                    height: '14px',
                    width: '30%',
                    borderRadius: '4px',
                  })}
                />
              </VStack>
            </Flex>
          ))}
        </VStack>
      </Box>

      <VStack gap="md">
        <Flex
          justify="space-between"
          className={css({
            width: '100%',
          })}
        >
          <Skeleton
            className={css({
              height: '16px',
              width: '60px',
              borderRadius: '4px',
            })}
          />
          <Skeleton
            className={css({
              height: '16px',
              width: '80px',
              borderRadius: '4px',
            })}
          />
        </Flex>
        <Skeleton
          className={css({
            height: '40px',
            width: '100%',
            borderRadius: 'md',
          })}
        />
      </VStack>
    </Box>
  );
}
