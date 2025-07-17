import { NextRequest, NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBig = require('json-bigint')
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { headers } from 'next/headers'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { keywords } = await req.json()

  // Try to get token from session first
  const session = await getServerSession(authOptions)
  const headersList = headers()
  const authHeader = headersList.get('authorization')

  // Extract token from Authorization header if present
  const bearerToken = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null

  // Use either session token or bearer token
  const accessToken = session?.accessToken || bearerToken

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new SquareClient({
    environment: SquareEnvironment.Sandbox,
    token: accessToken,
  });

  try {
    const response = await client.catalog.search({
      objectTypes: ['ITEM_VARIATION', 'IMAGE'],
      query: {
        textQuery: {
          keywords,
        },
      },
      includeRelatedObjects: true,
    });

    return new NextResponse(JSONBig.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Search API: Error occurred', {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      stack: error.stack
    })

    return NextResponse.json(
      { error: 'Search failed', message: error.message },
      { status: error.statusCode || 500 }
    )
  }
}
