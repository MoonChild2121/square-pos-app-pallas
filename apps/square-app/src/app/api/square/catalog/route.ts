import { SquareClient, SquareEnvironment } from 'square'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import JSONbig from 'json-bigint'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  try {
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

    console.log('Catalog API: Auth check', {
      hasSessionToken: !!session?.accessToken,
      hasBearerToken: !!bearerToken,
      finalTokenExists: !!accessToken
    })

    if (!accessToken) {
      console.error('Catalog API: No access token found', {
        sessionExists: !!session,
        hasSessionToken: !!session?.accessToken,
        authHeaderExists: !!authHeader,
        hasBearerToken: !!bearerToken
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = new SquareClient({
      token: accessToken,
      environment: SquareEnvironment.Sandbox,
    })

    // Fetch catalog items, taxes, discounts, and images in parallel
    const [catalogResponse, taxResponse, discountResponse, imagesResponse] = await Promise.all([
      client.catalog.list({ types: 'ITEM' }),
      client.catalog.list({ types: 'TAX' }),
      client.catalog.list({ types: 'DISCOUNT' }),
      client.catalog.list({ types: 'IMAGE' }),
    ]).catch(error => {
      console.error('Catalog API: Square API call failed', {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.errors,
        stack: error.stack
      })
      throw error
    })

    // Process catalog items
    const serializedCatalog = JSONbig({ useNativeBigInt: true }).stringify(catalogResponse.data)
    const catalogData = JSON.parse(serializedCatalog)
    const items = catalogData.filter((item: any) => item.type === 'ITEM')

    // Process tax items
    const serializedTaxes = JSONbig({ useNativeBigInt: true }).stringify(taxResponse.data)
    const taxData = JSON.parse(serializedTaxes)
    const taxes = taxData.filter((item: any) => item.type === 'TAX')

    // Process discount items
    const serializedDiscounts = JSONbig({ useNativeBigInt: true }).stringify(discountResponse.data)
    const discountData = JSON.parse(serializedDiscounts)
    const discounts = discountData.filter((item: any) => item.type === 'DISCOUNT')

    // Process image data
    const serializedImages = JSONbig({ useNativeBigInt: true }).stringify(imagesResponse.data)
    const imagesData = JSON.parse(serializedImages)
    const imageMap = imagesData.reduce((acc: Record<string, string>, obj: any) => {
      if (obj.type === 'IMAGE' && obj.imageData?.url) {
        acc[obj.id] = obj.imageData.url
      }
      return acc
    }, {})

    console.log('Catalog API: Successfully processed data', {
      itemCount: items.length,
      taxCount: taxes.length,
      discountCount: discounts.length,
      imageCount: Object.keys(imageMap).length
    })

    return NextResponse.json({ 
      items, 
      taxes,
      discounts,
      images: imageMap 
    })
  } catch (error: any) {
    console.error('Catalog API: Unhandled error', {
      error: error.message,
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      details: error.errors || error.details,
      stack: error.stack,
      type: typeof error
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch catalog data', 
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: error.statusCode || 500 }
    )
  }
}
