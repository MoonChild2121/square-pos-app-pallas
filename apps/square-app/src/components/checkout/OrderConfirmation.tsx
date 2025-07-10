'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { Heading, Paragraph } from '@/components/ui/typography'
import { OrderItemCard } from './OrderItemCard'
import { OrderDetails } from '../cart/OrderDetails'
import { useCart } from '@/contexts/CartContext'
import { useEffect, useState, useCallback } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import { css } from '@styled-system/css'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'

interface OrderResponse {
  data: any
  error?: string
}

export function OrderConfirmation() {
  const { state, clearCart } = useCart()
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const { getVariantImageUrl } = useCatalog()
  const router = useRouter()
  const pathname = usePathname()

  const calculateOrder = async () => {
    setLoading(true)
    try {
      const lineItems = state.items.map(item => ({
        quantity: String(item.quantity),
        catalogObjectId: item.id,
        appliedTaxes: item.taxIds?.map(taxId => ({
          taxUid: taxId,
          uid: taxId
        })) || []
      }))

      const response = await fetch('/api/square/orders/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            discounts: [],
            locationId: "LZQE34F36831W",
            lineItems,
            pricingOptions: {
              autoApplyDiscounts: true,
              autoApplyTaxes: true,
            },
          },
        }),
      })

      const data = await response.json()
      setOrderResponse({ data })
    } catch (error) {
      setOrderResponse({ data: null, error: 'Failed to calculate order' })
    } finally {
      setLoading(false)
    }
  }

  const handleContinueShopping = useCallback(() => {
    router.replace('/menu?clear=true')
  }, [router])

  useEffect(() => {
    if (state.items.length > 0) {
      calculateOrder()
    }
  }, [state.items])

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

  const order = orderResponse?.data?.order

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
            {loading ? (
              <VStack gap="3" w="100%">
                {Array.from({ length: state.items.length }).map((_, i) => (
                  <Box
                    key={i}
                    className={css({
                      h: '100px',
                      w: '100%',
                      bg: 'surface.variant',
                      opacity: '0.7'
                    })}
                  />
                ))}
              </VStack>
            ) : orderResponse?.error ? (
              <VStack 
                gap="4"
                className={css({
                  p: '4',
                  bg: 'surface.error.container',
                  borderRadius: 'lg',
                  boxShadow: 'md',
                })}
              >
                <Heading level={3} className={css({ color: 'error' })}>Error</Heading>
                <Paragraph className={css({ color: 'error' })}>{orderResponse.error}</Paragraph>
              </VStack>
            ) : order?.lineItems?.map((item: any) => (
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
          {loading ? (
            <VStack gap="4" w="100%">
            </VStack>
          ) : orderResponse?.error ? (
            <VStack>
              <Heading level={4} className={css({ color: 'error' })}>Error</Heading>
              <Paragraph className={css({ color: 'error' })}>{orderResponse.error}</Paragraph>
            </VStack>
          ) : order ? (
            <>
              <OrderDetails order={order} />
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