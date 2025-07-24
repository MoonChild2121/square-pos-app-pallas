'use server'

import { SquareClient, SquareEnvironment } from 'square'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
const JSONbig = require('json-bigint')

export async function calculateOrderAction(orderPayload: any) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error('Unauthorized')
  }

  const client = new SquareClient({
    token: session.accessToken,
    environment: SquareEnvironment.Sandbox,
  })

  const response = await client.orders.calculate(orderPayload)
  // Use json-bigint to handle BigInt serialization
  const serializedData = JSONbig({ useNativeBigInt: true }).stringify(response)
  const parsedData = JSON.parse(serializedData)
  return parsedData
} 