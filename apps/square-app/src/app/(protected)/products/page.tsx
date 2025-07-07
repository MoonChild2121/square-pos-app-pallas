'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { css } from '@styled-system/css';
import { Stack } from '@styled-system/jsx';
import Image from 'next/image';

interface PriceMoney {
  amount: number;
  currency: string;
}

interface ItemVariation {
  itemVariationData: {
    name: string;
    priceMoney: PriceMoney;
    imageIds?: string[];
  };
}

interface ModifierListInfo {
  modifierListId: string;
  enabled: boolean;
}

interface ModifierData {
  name: string;
  priceMoney: PriceMoney;
  onByDefault: boolean;
}

interface ModifierListData {
  name: string;
  selectionType: string;
  modifiers: {
    modifierData: ModifierData;
  }[];
}

interface ModifierInfo {
  id: string;
  modifierListData: ModifierListData;
}

interface CatalogItem {
  type: string;
  itemData: {
    name: string;
    variations: ItemVariation[];
    modifierListInfo?: ModifierListInfo[];
  };
  id: string;
}

interface ImageData {
  id: string;
  url: string;
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [catalogData, setCatalogData] = useState<CatalogItem[]>([]);
  const [imageData, setImageData] = useState<Record<string, string>>({});
  const [modifierData, setModifierData] = useState<Record<string, ModifierInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchCatalog();
    }
  }, [status, router]);

  async function fetchImageUrl(imageId: string) {
    try {
      const response = await fetch(`/api/square/image/${imageId}`);
      if (!response.ok) throw new Error('Failed to fetch image');
      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error fetching image:', err);
      return null;
    }
  }

  async function fetchModifierList(modifierId: string) {
    try {
      const response = await fetch(`/api/square/modifier/${modifierId}`);
      if (!response.ok) throw new Error('Failed to fetch modifier');
      const data = await response.json();
      return data.object;
    } catch (err) {
      console.error('Error fetching modifier:', err);
      return null;
    }
  }

  async function fetchCatalog() {
    try {
      setLoading(true);
      const response = await fetch('/api/square/catalog');
      if (!response.ok) {
        throw new Error('Failed to fetch catalog');
      }
      
      const data = await response.json();
      const items = data.filter((item: CatalogItem) => item.type === 'ITEM');
      setCatalogData(items);

      // Fetch images for all variations
      const imagePromises: Promise<[string, string | null]>[] = [];
      items.forEach((item: CatalogItem) => {
        item.itemData.variations.forEach((variation: ItemVariation) => {
          if (variation.itemVariationData.imageIds?.length) {
            imagePromises.push(
              fetchImageUrl(variation.itemVariationData.imageIds[0])
                .then(url => [variation.itemVariationData.imageIds![0], url])
            );
          }
        });
      });

      // Fetch modifiers for all items
      const modifierPromises: Promise<[string, ModifierInfo | null]>[] = [];
      items.forEach((item: CatalogItem) => {
        if (item.itemData.modifierListInfo) {
          item.itemData.modifierListInfo.forEach((modifier) => {
            if (modifier.enabled) {
              modifierPromises.push(
                fetchModifierList(modifier.modifierListId)
                  .then(data => [modifier.modifierListId, data])
              );
            }
          });
        }
      });

      const [imageResults, modifierResults] = await Promise.all([
        Promise.all(imagePromises),
        Promise.all(modifierPromises)
      ]);

      const imageMap: Record<string, string> = {};
      imageResults.forEach(([id, url]) => {
        if (url) imageMap[id] = url;
      });
      setImageData(imageMap);

      const modifierMap: Record<string, ModifierInfo> = {};
      modifierResults.forEach(([id, data]) => {
        if (data) modifierMap[id] = data;
      });
      setModifierData(modifierMap);

    } catch (err) {
      console.error('Error loading catalog:', err);
      setError('Error loading catalog');
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  if (status === 'loading' || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Stack direction="column" gap={6} p={6}>
      <h1 className={css({ fontSize: "2xl", fontWeight: "semibold" })}>
        Products Catalog
      </h1>
      
      {catalogData.length === 0 ? (
        <div>No items found in catalog.</div>
      ) : (
        <Stack direction="column" gap={8}>
          {catalogData.map((item) => (
            <div
              key={item.id}
              className={css({
                p: 6,
                borderRadius: 'md',
                border: '1px solid',
                borderColor: 'gray.200'
              })}
            >
              <h2 className={css({ 
                fontSize: 'xl', 
                fontWeight: 'semibold',
                mb: 4
              })}>
                {item.itemData.name}
              </h2>

              <Stack direction="column" gap={4} pl={4}>
                {item.itemData.variations.map((variation, index) => (
                  <Stack 
                    key={index} 
                    direction="row" 
                    justify="space-between"
                    align="center"
                  >
                    <Stack direction="row" gap={4} align="center">
                      {variation.itemVariationData.imageIds?.[0] && imageData[variation.itemVariationData.imageIds[0]] && (
                        <img 
                          src={imageData[variation.itemVariationData.imageIds[0]]} 
                          alt={variation.itemVariationData.name}
                          width={50}
                          height={50}
                        />
                      )}
                      <div>{variation.itemVariationData.name}</div>
                    </Stack>
                    <div className={css({ fontWeight: 'medium' })}>
                      {formatPrice(
                        variation.itemVariationData.priceMoney.amount,
                        variation.itemVariationData.priceMoney.currency
                      )}
                    </div>
                  </Stack>
                ))}
              </Stack>

              {item.itemData.modifierListInfo && item.itemData.modifierListInfo.length > 0 && (
                <Stack direction="column" gap={2} mt={4}>
                  <div className={css({ fontWeight: 'medium' })}>
                    Available Modifiers:
                  </div>
                  {item.itemData.modifierListInfo
                    .filter(mod => mod.enabled)
                    .map((modifier, index) => {
                      const modifierDetails = modifierData[modifier.modifierListId];
                      return (
                        <div key={index} className={css({ pl: 4 })}>
                          <div className={css({ fontWeight: 'medium', color: 'gray.700' })}>
                            {modifierDetails?.modifierListData.name}:
                          </div>
                          <Stack direction="column" gap={1} pl={4} mt={1}>
                            {modifierDetails?.modifierListData.modifiers.map((mod, modIndex) => (
                              <Stack key={modIndex} direction="row" justify="space-between">
                                <div>{mod.modifierData.name}</div>
                                {mod.modifierData.priceMoney.amount > 0 && (
                                  <div>
                                    +{formatPrice(
                                      mod.modifierData.priceMoney.amount,
                                      mod.modifierData.priceMoney.currency
                                    )}
                                  </div>
                                )}
                              </Stack>
                            ))}
                          </Stack>
                        </div>
                      );
                    })}
                </Stack>
              )}
            </div>
          ))}
        </Stack>
      )}
    </Stack>
  );
}