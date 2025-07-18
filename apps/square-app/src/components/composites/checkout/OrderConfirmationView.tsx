'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/primitives/ui/typography'
import { OrderItemCard } from '@/components/composites/orders/OrderItemCard'
import { OrderDetails } from '@/components/composites/orders/OrderDetails'
import { OrderDetailsSkeleton } from '@/components/composites/skeletons/order-skeletons/OrderDetailsSkeleton'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/primitives/ui/button'
import { css } from '@styled-system/css'
import { orderConfirmation } from '@styled-system/recipes'
import { OrderConfirmationViewProps } from '@/components/composites/checkout/types'

export function OrderConfirmationView({
  state,
  catalogLoading,
  getVariantImageUrl,
  onContinueShopping
}: OrderConfirmationViewProps) {
  const { pageContainer, cardContainer, emptyState, successAlert, contentGrid, itemsSection } = orderConfirmation()
  
  if (state.items.length === 0) {
    return (
      <Box className={pageContainer}>
        <VStack 
          className={`${cardContainer} ${emptyState}`}
        >
          <Heading level={2}>No order found</Heading>
          <Paragraph>No items in your order</Paragraph>
        </VStack>
      </Box>
    )
  }

  return (
    <Box className={pageContainer}>
      {/* Success Message */}
      <Box className={successAlert}>
        <CheckCircle 
          size={24}
          className={css({ 
            flexShrink: 0,
            w: { base: '20px', sm: '24px' },
            h: { base: '20px', sm: '24px' }
          })}
        />
        <VStack 
          gap="gap.inline.sm" 
          align="center"
          className={css({ 
            textAlign: { base: 'center', sm: 'left' } 
          })}
        >
          <Heading 
            level={5}
            className={css({ 
              fontSize: { base: 'text.sm', sm: 'text.base' },
              lineHeight: 'tight'
            })}
          >
            Order Placed Successfully!
          </Heading>
          <Paragraph 
            className={css({ 
              fontSize: { base: 'text.xs', sm: 'text.sm' },
              lineHeight: 'normal'
            })}
          >
            Thank you for your order. We'll process it right away.
          </Paragraph>
        </VStack>
      </Box>

      {/* Header */}
      <Box
        className={css({
          mb: { base: 'padding.block.md', sm: 'padding.block.lg' },
          textAlign: { base: 'center', sm: 'left' }
        })}
      >
        <Paragraph 
          size="base" 
          className={css({ 
            color: 'text.secondary',
            fontSize: { base: 'text.sm', sm: 'text.base' }
          })}
        >
          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Paragraph>
      </Box>

      {/* Content Grid */}
      <Box className={contentGrid}>
        {/* Items Section */}
        <VStack className={itemsSection}>
          <Heading 
            level={3}
            className={css({ 
              fontSize: { base: 'text.lg', sm: 'text.xl' },
              mb: { base: 'padding.block.sm', sm: 'padding.block.md' }
            })}
          >
            Order Items
          </Heading>
          <VStack 
            gap={{ base: 'gap.inline.sm', sm: 'gap.inline.md' }}
            className={css({ w: 'full' })}
          >
            {catalogLoading ? (
              <Paragraph>Loading items...</Paragraph>
            ) : state.order?.lineItems?.map((item: any) => (
              <OrderItemCard 
                key={item.uid} 
                item={item} 
                imageUrl={getVariantImageUrl(item.catalogObjectId)} 
              />
            ))}
          </VStack>
        </VStack>

        {/* Summary Section */}
        <VStack
          className={css({
            gridArea: 'summary',
            gap: { base: 'gap.inline.md', sm: 'gap.inline.lg' }
          })}
        >
          {catalogLoading ? (
            <OrderDetailsSkeleton />
          ) : state.order ? (
            <>
              <Box
                className={css({
                  bg: 'surface.container',
                  borderRadius: { base: 'lg', md: 'xl' },
                  p: { base: 'padding.block.sm', sm: 'padding.block.md' },
                  boxShadow: { base: 'sm', md: 'md' },
                  w: 'full'
                })}
              >
                <OrderDetails order={state.order} />
              </Box>
              
              <Button 
                variant="primary" 
                onClick={onContinueShopping}
                className={css({ 
                  w: { base: 'full', sm: '75%', md: '50%' },
                  mx: 'auto',
                  fontSize: { base: 'text.sm', sm: 'text.base' },
                  py: { base: 'padding.block.sm', sm: 'padding.block.md' }
                })}
              >
                Continue Shopping
              </Button>
            </>
          ) : null}
        </VStack>
      </Box>
    </Box>
  )
}