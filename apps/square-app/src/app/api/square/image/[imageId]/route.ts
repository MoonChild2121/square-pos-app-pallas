import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';  

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
    }

    const client = new SquareClient({
      token: session.accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    const response = await client.catalog.object.get({
      objectId: params.imageId,
    });

    if (response.object?.type !== 'IMAGE' || !response.object.imageData?.url) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });  
    }

    return NextResponse.json({ url: response.object.imageData.url });  
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image data' },
      { status: 500 }
    ); 
  }
}
