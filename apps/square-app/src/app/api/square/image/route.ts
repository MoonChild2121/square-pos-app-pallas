import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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

    const response = await client.catalog.list({
      types: "IMAGE"
    });

    if (!response.data || response.data.length === 0) {
      return NextResponse.json({ error: 'No images found' }, { status: 404 });  
    }

    // Create a map of image IDs to URLs
    const imageMap = response.data.reduce((acc: Record<string, string>, obj: any) => {
      if (obj.type === 'IMAGE' && obj.imageData?.url) {
        acc[obj.id] = obj.imageData.url;
      }
      return acc;
    }, {});

    return NextResponse.json(imageMap);
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    ); 
  }
} 