import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { fetchSquareSearch } from '@/shared/services/catalog/fetch-logic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { keywords, categoryId } = await req.json();

    // Get the session and access token securely on the server.
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the core logic function to fetch search results
    const searchData = await fetchSquareSearch(
      accessToken,
      keywords,
      categoryId
    );
    return NextResponse.json(searchData);
  } catch (error: any) {
    console.error('Search API: Error occurred', {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Search failed', message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
