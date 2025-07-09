import { SquareClient, SquareEnvironment } from 'square';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import JSONbig from 'json-bigint';
import util from 'util';
import { NextResponse } from 'next/server'; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    if (!session.accessToken) {
      console.error('No access token in session:', session);
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
    }

    console.log('Using access token:', session.accessToken);

    const client = new SquareClient({
      token: session.accessToken,
      environment: SquareEnvironment.Sandbox,
    });

    const catalogResponse = await client.catalog.list({ types: "ITEM" });

    const serializedData = JSONbig({ useNativeBigInt: true }).stringify(catalogResponse.data);
    const parsedData = JSON.parse(serializedData);

    console.log("from catalog:");
    console.log(catalogResponse.data);
    console.log("from bigint:");
    console.log(util.inspect(parsedData, { depth: null, colors: true }));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog data', details: error.message },
      { status: 500 }
    );
  }
}
