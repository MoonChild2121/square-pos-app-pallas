'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/primitives/ui/typography'
import { OrderItemCard } from '@/components/composites/orders/OrderItemCard'
import { OrderDetails } from '@/components/composites/orders/OrderDetails'
import { OrderSummarySkeleton } from '@/components/composites/skeletons/order-skeletons/OrderSummarySkeleton'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/primitives/ui/button'
import { css } from '@styled-system/css'
import { OrderConfirmationViewProps } from '@/components/composites/checkout/types'

export function OrderConfirmationView({
  state,
  catalogLoading,
  getVariantImageUrl,
  onContinueShopping
}: OrderConfirmationViewProps) {
  
  if (state.items.length === 0) {
    return (
      <Box className={css({ 
        minH: '100vh', 
        p: 'padding.inline.lg', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      })}>
        <VStack gap="gap.inline.lg" align="center">
          <Heading level={2}>No order found</Heading>
          <Paragraph>No items in your order</Paragraph>
        </VStack>
      </Box>
    )
  }

  return (
    <Box className={css({ 
      minH: '100vh', 
      bg: 'surface.container', 
      p: 'padding.inline.lg' 
    })}>
      <Box className={css({ maxW: '4xl', mx: 'auto' })}>
        
        {/* Success Message - Keep your existing header styling */}
        <HStack 
          gap="gap.inline.lg" 
          className={css({
            p: 'padding.inline.lg',
            color: 'success.text',
            bg: 'success.bg',
            borderRadius: 'lg',
            border: '1px solid',
            borderColor: 'success.border',
            mb: 'gap.inline.lg'
          })}
        >
          <CheckCircle size={24} />
          <VStack gap="gap.inline.sm">
            <Heading level={5}>Order Placed Successfully!</Heading>
            <Paragraph size="sm">Thank you for your order. We'll process it right away.</Paragraph>
          </VStack>
        </HStack>

        {/* Order Number */}
        <Paragraph 
          size="sm" 
          className={css({ 
            color: 'text.secondary',
            mb: 'gap.inline.lg'
          })}
        >
          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Paragraph>

        {/* Simple Two Column Layout */}
        <Box className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' },
          gap: 'gap.inline.lg'
        })}>
          
          {/* Order Items */}
          <VStack gap="gap.inline.sm" className={css({
            borderRadius: 'lg',
            boxShadow: 'sm',
            p: 'padding.inline.md',
            border: '1px solid',
            borderColor: 'border'
          })}>
            <Heading level={4}>Order Items</Heading>
            <VStack 
              gap="gap.inline.md" 
              className={css({ 
                w: 'full',
                maxH: '400px',
                overflowY: 'auto',
                pr: 'padding.inline.sm'
              })}
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

          {/* Order Summary */}
          <VStack gap="gap.inline.md">
            {catalogLoading ? (
              <OrderSummarySkeleton />
            ) : state.order ? (
              <>
                <OrderDetails order={state.order} />
                <Button 
                  variant="primary" 
                  onClick={onContinueShopping}
                  className={css({ w: 'full' })}
                >
                  Continue Shopping
                </Button>
              </>
            ) : null}
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}