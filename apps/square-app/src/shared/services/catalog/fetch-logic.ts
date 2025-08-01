import { SquareClient, SquareEnvironment } from 'square';
const JSONbigFactory = require('json-bigint');
const JSONBig = require('json-bigint');

/**
 * This function contains the core logic for fetching the entire catalog from the Square API.
 * It can be called from anywhere on the server (e.g., API routes, Server Components).
 * @param accessToken The user's access token for authentication.
 * @returns The processed catalog data.
 */
export async function fetchSquareCatalog(accessToken: string) {
  const client = new SquareClient({
    token: accessToken,
    environment: SquareEnvironment.Sandbox,
  });

  // Create a JSONbig instance with useNativeBigInt: true
  const JSONbigNative = JSONbigFactory({ useNativeBigInt: true });

  // Fetch catalog items, taxes, discounts, images, and modifiers in parallel
  const [catalogResponse, taxResponse, discountResponse, imagesResponse, modifierResponse] =
    await Promise.all([
      client.catalog.list({ types: 'ITEM' }),
      client.catalog.list({ types: 'TAX' }),
      client.catalog.list({ types: 'DISCOUNT' }),
      client.catalog.list({ types: 'IMAGE' }),
      client.catalog.list({ types: 'MODIFIER' }),
    ]).catch((error) => {
      console.error('Square Logic: Square API call failed', {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.errors,
        stack: error.stack,
      });
      throw error;
    });

  // Process catalog items
  const serializedCatalog = JSONbigNative.stringify(catalogResponse.data);
  const catalogData = JSON.parse(serializedCatalog);
  const items = catalogData.filter((item: any) => item.type === 'ITEM');

  // Process tax items
  const serializedTaxes = JSONbigNative.stringify(taxResponse.data);
  const taxData = JSON.parse(serializedTaxes);
  const taxes = taxData.filter((item: any) => item.type === 'TAX');

  // Process discount items
  const serializedDiscounts = JSONbigNative.stringify(discountResponse.data);
  const discountData = JSON.parse(serializedDiscounts);
  const discounts = discountData.filter((item: any) => item.type === 'DISCOUNT');

  // Process image data
  const serializedImages = JSONbigNative.stringify(imagesResponse.data);
  const imagesData = JSON.parse(serializedImages);
  const imageMap = imagesData.reduce((acc: Record<string, string>, obj: any) => {
    if (obj.type === 'IMAGE' && obj.imageData?.url) {
      acc[obj.id] = obj.imageData.url;
    }
    return acc;
  }, {});

  // Process modifier data
  const serializedModifiers = JSONbigNative.stringify(modifierResponse.data);
  const modifierData = JSON.parse(serializedModifiers);
  const modifiers = modifierData.filter((item: any) => item.type === 'MODIFIER');

  return {
    items,
    taxes,
    discounts,
    images: imageMap,
    modifiers,
  };
}

/**
 * This function contains the core logic for searching the catalog from the Square API.
 * @param accessToken The user's access token for authentication.
 * @param keywords The keywords to search for.
 * @param categoryId An optional category to scope the search.
 * @returns The raw search response, parsed to handle BigInts.
 */
export async function fetchSquareSearch(
  accessToken: string,
  keywords: string[],
  categoryId?: string
) {
  const client = new SquareClient({
    environment: SquareEnvironment.Sandbox,
    token: accessToken,
  });

  const query: any = {
    textQuery: {
      keywords,
    },
  };

  if (categoryId) {
    query.itemQuery = {
      category_ids: [categoryId],
    };
  }

  const response = await client.catalog.search({
    objectTypes: ['ITEM_VARIATION', 'IMAGE'],
    query,
    includeRelatedObjects: true,
  });

  // The result from the Square SDK is already a JSON object,
  // but we stringify/parse it with a BigInt-aware parser to ensure
  // IDs are handled correctly as strings, not numbers that could lose precision,
  // mimicking the behavior of an HTTP transport layer.
  const serialized = JSONBig.stringify(response);
  return JSONBig.parse(serialized);
}
