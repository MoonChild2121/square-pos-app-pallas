'use client'

import { Box, VStack, HStack, Grid } from '@styled-system/jsx'
import { useCart } from '@/contexts/CartContext'
import { useEffect, useState } from 'react'
import { Heading, Paragraph } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { css } from '@styled-system/css'

interface OrderResponse {
  data: any
  error?: string
}

const formatMoney = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

export default function CheckoutPage() {
  const { state } = useCart()
  const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(false)

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
      <Box p="4">
        <Heading>Your cart is empty</Heading>
      </Box>
    )
  }

  const order = orderResponse?.data?.order

  return (
    <Box p="4">
      <VStack gap="6">
        <Heading>Order Summary</Heading>
        
        {/* Items List */}
        <VStack gap="4" w="100%">
          {order?.lineItems?.map((item: any) => (
            <Box 
              key={item.uid} 
              className={css({
                p: '4',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'md'
              })}
            >
              <Grid columns={2} gap="4">
                <VStack gap="1">
                  <Heading level={4}>{item.name} - {item.variationName}</Heading>
                  <Paragraph>Quantity: {item.quantity}</Paragraph>
                  <Paragraph>Price per item: {formatMoney(item.basePriceMoney.amount)}</Paragraph>
                  {item.totalTaxMoney.amount > 0 && (
                    <Paragraph>Tax: {formatMoney(item.totalTaxMoney.amount)}</Paragraph>
                  )}
                  {item.totalDiscountMoney.amount > 0 && (
                    <Paragraph color="error">
                      Discount: -{formatMoney(item.totalDiscountMoney.amount)}
                    </Paragraph>
                  )}
                </VStack>
                <Box>
                  <Heading level={4} className={css({ textAlign: 'right' })}>
                    {formatMoney(item.totalMoney.amount)}
                  </Heading>
                </Box>
              </Grid>
            </Box>
          ))}
        </VStack>

        {/* Order Details */}
        {loading ? (
          <Paragraph>Calculating order...</Paragraph>
        ) : orderResponse?.error ? (
          <Paragraph color="error">{orderResponse.error}</Paragraph>
        ) : order ? (
          <VStack 
            gap="4" 
            className={css({
              p: '4',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'md',
              bg: 'surface.container',
            })}
          >
            <Heading level={3}>Order Details</Heading>
            
            {/* Taxes */}
            {order.taxes && order.taxes.length > 0 && (
              <VStack gap="2" w="100%">
                <Heading level={4}>Applied Taxes</Heading>
                {order.taxes.map((tax: any) => (
                  <Grid key={tax.uid} columns={2} w="100%">
                    <Paragraph>{tax.name} ({tax.percentage}%)</Paragraph>
                    <Paragraph>{formatMoney(tax.appliedMoney.amount)}</Paragraph>
                  </Grid>
                ))}
              </VStack>
            )}

            {/* Discounts */}
            {order.discounts && order.discounts.length > 0 && (
              <VStack gap="2" w="100%">
                <Heading level={4}>Applied Discounts</Heading>
                {order.discounts.map((discount: any) => (
                  <Grid key={discount.uid} columns={2} w="100%">
                    <Paragraph>{discount.name} ({discount.percentage}%)</Paragraph>
                    <Paragraph color="error">
                      -{formatMoney(discount.appliedMoney.amount)}
                    </Paragraph>
                  </Grid>
                ))}
              </VStack>
            )}

            {/* Totals */}
            <VStack 
              gap="2" 
              w="100%" 
              className={css({
                borderTop: '2px solid',
                borderColor: 'border',
                pt: '4',
                mt: '2'
              })}
            >
              <Grid columns={2} w="100%">
                <Paragraph>Subtotal</Paragraph>
                <Paragraph>
                  {formatMoney(
                    order.totalMoney.amount - 
                    order.totalTaxMoney.amount + 
                    order.totalDiscountMoney.amount
                  )}
                </Paragraph>
              </Grid>
              
              {order.totalDiscountMoney.amount > 0 && (
                <Grid columns={2} w="100%">
                  <Paragraph>Discounts</Paragraph>
                  <Paragraph color="error">
                    -{formatMoney(order.totalDiscountMoney.amount)}
                  </Paragraph>
                </Grid>
              )}

              <Grid columns={2} w="100%">
                <Paragraph>Tax</Paragraph>
                <Paragraph>{formatMoney(order.totalTaxMoney.amount)}</Paragraph>
              </Grid>

              <Grid 
                columns={2}
                w="100%" 
                className={css({
                  borderTop: '1px solid',
                  borderColor: 'border',
                  pt: '2',
                  mt: '2',
                  fontWeight: 'bold'
                })}
              >
                <Heading level={4}>Total</Heading>
                <Heading level={4}>{formatMoney(order.totalMoney.amount)}</Heading>
              </Grid>
            </VStack>
          </VStack>
        ) : null}

        <Button 
          width="full" 
          onClick={calculateOrder} 
          isLoading={loading}
        >
          Recalculate Order
        </Button>
      </VStack>
    </Box>
  )
} 