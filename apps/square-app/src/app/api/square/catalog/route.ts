import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import JSONbig from 'json-bigint';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = new SquareClient({
      token: session.accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    // Fetch both catalog items and images in parallel
    const [catalogResponse, imagesResponse] = await Promise.all([
      client.catalog.list({ types: "ITEM" }),
      client.catalog.list({ types: "IMAGE" })
    ]);

    // Process catalog data
    const serializedCatalog = JSONbig({ useNativeBigInt: true }).stringify(catalogResponse.data);
    const catalogData = JSON.parse(serializedCatalog);
    const items = catalogData.filter((item: any) => item.type === 'ITEM');

    // Process image data
    const serializedImages = JSONbig({ useNativeBigInt: true }).stringify(imagesResponse.data);
    const imagesData = JSON.parse(serializedImages);
    const imageMap = imagesData.reduce((acc: Record<string, string>, obj: any) => {
      if (obj.type === 'IMAGE' && obj.imageData?.url) {
        acc[obj.id] = obj.imageData.url;
      }
      return acc;
    }, {});

    // Add caching headers to the response
    return NextResponse.json(
      { items, images: imageMap },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog data', details: error.message },
      { status: 500 }
    );
  }
}
