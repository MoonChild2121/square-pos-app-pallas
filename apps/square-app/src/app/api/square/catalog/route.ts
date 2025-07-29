import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { fetchSquareCatalog } from '@/shared/services/catalog/fetch-logic';

export async function GET() {
  try {
    // Get the session and access token securely on the server.
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      console.error('Catalog API: No access token found in session.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the core logic function to fetch data
    const catalogData = await fetchSquareCatalog(accessToken);

    return NextResponse.json(catalogData);
  } catch (error: any) {
    console.error('Catalog API: Unhandled error', {
      error: error.message,
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      details: error.errors || error.details,
      stack: error.stack,
      type: typeof error,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch catalog data',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      },
      { status: error.statusCode || 500 }
    );
  }
}
