import { Box, VStack, Grid } from '@styled-system/jsx'
import { useCart } from '@/contexts/CartContext'
import { useEffect, useState } from 'react'
import { Heading, Paragraph } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { css } from '@styled-system/css'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderItemCard } from './OrderItemCard'
import { OrderDetails } from '../cart/OrderDetails'
import { useCatalog } from '@/hooks/useCatalog'

interface OrderResponse {
  data: any
  error?: string
}

export function CheckoutSummary() {
  const { state } = useCart()
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const { getVariantImageUrl } = useCatalog()

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

  useEffect(() => {
    if (state.items.length > 0) {
      calculateOrder()
    }
  }, [state.items])

  if (state.items.length === 0) {
    return (
      <VStack 
        gap="4" 
        className={css({
          p: '4',
          bg: 'surface.container',
          borderRadius: 'lg',
          boxShadow: 'md',
          alignItems: 'center',
          justifyContent: 'center',
          minH: '300px'
        })}
      >
        <Heading level={2} className={css({ color: 'text.primary', fontSize: 'lg' })}>Your cart is empty</Heading>
        <Paragraph className={css({ color: 'text.secondary' })}>Add some items to get started</Paragraph>
      </VStack>
    )
  }

  const order = orderResponse?.data?.order

  return (
    <VStack gap="4" w="100%" maxW="1200px" mx="auto">
      <Heading level={1} className={css({ color: 'text.primary', fontSize: 'xl' })}>
        Order Summary
      </Heading>

      <Grid 
        columns={{ base: 1, md: 2 }} 
        gap="4" 
        w="100%"
        className={css({
          h: 'calc(100vh - 180px)', // Account for padding, header and page title
          alignItems: 'start',
        })}
      >
        {/* Left Column - Items */}
        <VStack gap="3" className={css({ 
          h: '100%',
          overflowY: 'auto',
          pr: '2', // Add padding for scrollbar
        })}>
          {loading ? (
            Array.from({ length: state.items.length }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={css({
                  h: '100px',
                  w: '100%',
                  borderRadius: 'lg'
                })}
              />
            ))
          ) : order?.lineItems?.map((item: any) => (
            <OrderItemCard 
              key={item.uid} 
              item={item} 
              imageUrl={getVariantImageUrl(item.catalogObjectId)} 
            />
          ))}
        </VStack>

        {/* Right Column - Order Details & Actions */}
        <VStack gap="4">
          {loading ? (
            <Skeleton 
              className={css({
                h: '300px',
                w: '100%',
                borderRadius: 'lg'
              })}
            />
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
              <Heading level={3} className={css({ color: 'error', fontSize: 'md' })}>Error</Heading>
              <Paragraph className={css({ color: 'error' })}>{orderResponse.error}</Paragraph>
              <Button 
                variant="outlined" 
                color="error"
                onClick={calculateOrder}
              >
                Try Again
              </Button>
            </VStack>
          ) : order ? (
            <OrderDetails order={order} />
          ) : null}

          <Button 
            width="full"
            size="lg"
            onClick={calculateOrder} 
            isLoading={loading}
            className={css({
              bg: 'primary',
              color: 'primary.foreground',
              _hover: {
                bg: 'primary.emphasized',
              }
            })}
          >
            Proceed to Payment
          </Button>
        </VStack>
      </Grid>
    </VStack>
  )
} 