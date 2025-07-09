import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import JSONbig from 'json-bigint';

export async function GET(
  request: Request,
  { params }: { params: { taxId: string } }
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
      objectId: params.taxId,
    });

    if (response.object?.type !== 'TAX') {
      console.log('Tax object response:', JSONbig({ useNativeBigInt: true }).stringify(response.object));
      return NextResponse.json({ error: 'Tax not found' }, { status: 404 });
    }

    // Use json-bigint to handle BigInt serialization
    const serializedData = JSONbig({ useNativeBigInt: true }).stringify(response);
    const parsedData = JSON.parse(serializedData);
    
    console.log('Tax object found:', parsedData.object);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error fetching tax:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax data' },
      { status: 500 }
    );
  }
} 