import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import JSONbig from 'json-bigint';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = new SquareClient({
      token: session.accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    const body = await request.json();
    const response = await client.orders.calculate(body);

    // Use json-bigint to handle BigInt serialization
    const serializedData = JSONbig({ useNativeBigInt: true }).stringify(response);
    const parsedData = JSON.parse(serializedData);
    
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error calculating order:', error);
    return NextResponse.json(
      { error: 'Failed to calculate order', details: error.message },
      { status: 500 }
    );
  }
} 