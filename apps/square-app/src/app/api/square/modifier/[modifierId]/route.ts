import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import JSONbig from 'json-bigint';

export async function GET(
  request: Request,
  { params }: { params: { modifierId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    if (!session.accessToken) {
      console.error('No access token in session:', session);
      return Response.json({ error: 'Unauthorized - No access token' }, { status: 401 });
    }

    const client = new SquareClient({
      token: session.accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    const response = await client.catalog.object.get({
      objectId: params.modifierId
    });

    // Use json-bigint to handle BigInt serialization
    const serializedData = JSONbig({ useNativeBigInt: true }).stringify(response);
    const parsedData = JSON.parse(serializedData);
    console.log(parsedData);
    return Response.json(parsedData);
  } catch (error: any) {
    console.error('Error fetching modifier:', error);
    return Response.json(
      { error: 'Failed to fetch modifier data', details: error.message },
      { status: 500 }
    );
  }
} 