'use client'

import { Box, VStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { OrderItemCard } from '../orders/OrderItemCard'
import { OrderDetails } from '../orders/OrderDetails'
import { OrderDetailsSkeleton } from '../skeletons/order-skeletons/OrderDetailsSkeleton'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { css } from '@styled-system/css'
import { orderConfirmation } from '@styled-system/recipes'
import { OrderConfirmationViewProps } from '@/shared/types/checkout'

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
        <CheckCircle size={24}/>
        <VStack gap="gap.inline.sm" align="center">
          <Heading level={5}>Order Placed Successfully!</Heading>
          <Paragraph>Thank you for your order. We'll process it right away.</Paragraph>
        </VStack>
      </Box>

      {/* Header */}
      <Box>
        <Paragraph size="base" className={css({ color: 'text.secondary' })}>
          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Paragraph>
      </Box>

      {/* Content Grid */}
      <Box className={contentGrid}>
        {/* Items Section */}
        <VStack className={itemsSection}>
          <Heading level={3}>Order Items</Heading>
          <VStack>
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
        <VStack>
          {catalogLoading ? (
            <OrderDetailsSkeleton />
          ) : state.order ? (
            <>
              <OrderDetails order={state.order} />
              <Button 
                variant="primary" 
                onClick={onContinueShopping}
                className={css({ w: '50%'})}
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