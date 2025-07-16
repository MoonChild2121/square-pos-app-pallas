'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { OrderItemCard } from '../orders/OrderItemCard'
import { OrderDetails } from '../orders/OrderDetails'
import { OrderDetailsSkeleton } from '../skeletons/order-skeletons/OrderDetailsSkeleton'
import { useCart } from '@/contexts/CartContext'
import { useEffect, useCallback } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import { css } from '@styled-system/css'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export function OrderConfirmation() {
  const { state, clearCart } = useCart()
  const { getVariantImageUrl, isLoading: catalogLoading } = useCatalog()
  const router = useRouter()

  const handleContinueShopping = useCallback(() => {
    router.push('/menu?clear=true')
  }, [router])

  if (state.items.length === 0) {
    return (
      <Box className={css({
        minH: '100vh',
        bg: 'surface.container.lowest',
        p: { base: '4', md: '6', lg: '8' },
      })}>
        <VStack 
          gap="4" 
          className={css({
            bg: 'surface.container',
            borderRadius: 'xl',
            p: { base: '4', md: '6' },
            boxShadow: 'md',
            alignItems: 'center',
            justifyContent: 'center',
            minH: '300px'
          })}
        >
          <Heading level={2}>No order found</Heading>
          <Paragraph>No items in your order</Paragraph>
        </VStack>
      </Box>
    )
  }

  return (
    <Box className={css({
      minH: '100vh',
      bg: 'surface.container.lowest',
      p: { base: '4', md: '6', lg: '8' },
    })}>
      {/* Success Message */}
      <Box className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3',
        p: '4',
        color: 'success.text',
        bg: 'success.bg',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'success.border',
        mb: '6',
      })}>
        <CheckCircle size={24}/>
        <VStack gap="1" align="center">
          <Heading level={5}>Order Placed Successfully!</Heading>
          <Paragraph>Thank you for your order. We'll process it right away.</Paragraph>
        </VStack>
      </Box>

      {/* Header */}
      <Box className={css({
        textAlign: 'center',
        mb: { base: '6', md: '8' },
      })}>
        <Paragraph size="lg" className={css({ color: 'text.secondary' })}>
          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </Paragraph>
      </Box>

      {/* Content Grid */}
      <Box className={css({
        maxW: '1200px',
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' },
        gap: { base: '6', lg: '8' },
        alignItems: 'start',
      })}>
        {/* Items Section */}
        <VStack className={css({
          bg: 'surface.container',
          borderRadius: 'xl',
          p: { base: '4', md: '6' },
          boxShadow: 'md',
          maxH: 'calc(100vh - 300px)',
          overflowY: 'auto',
        })} gap="4">
          <Heading level={3}>Order Items</Heading>
          <VStack gap="3" w="100%">
            {catalogLoading ? (
              <VStack gap="3" w="100%">
                {Array.from({ length: state.items.length }).map((_, i) => (
                  <Box
                    key={i}
                    className={css({
                      p: '3',
                      bg: 'surface.container.low',
                      borderRadius: 'lg',
                      boxShadow: 'sm',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4',
                    })}
                  >
                    <Skeleton css={{ width: '60px', height: '60px', borderRadius: 'md' }} />
                    <VStack gap="2" css={{ flex: '1' }}>
                      <Skeleton css={{ width: '150px', height: '20px' }} />
                      <Skeleton css={{ width: '100px', height: '16px' }} />
                    </VStack>
                    <Skeleton css={{ width: '80px', height: '24px' }} />
                  </Box>
                ))}
              </VStack>
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
        <VStack gap="6">
          {catalogLoading ? (
            <OrderDetailsSkeleton />
          ) : state.order ? (
            <>
              <OrderDetails order={state.order} />
              <Button 
                variant="primary" 
                onClick={handleContinueShopping}
                className={css({
                  w: '50%',
                  mt: '4',
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