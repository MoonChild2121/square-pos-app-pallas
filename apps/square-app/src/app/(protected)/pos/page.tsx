'use client';

import { useState, useEffect } from 'react';
import { css } from '@styled-system/css';
import { Box, HStack, VStack } from '@styled-system/jsx';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

interface PriceMoney {
  amount: number;
  currency: string;
}

interface ItemVariation {
  id: string;
  name: string;
  priceMoney: PriceMoney;
}

interface CatalogItem {
  id: string;
  type: string;
  itemData: {
    name: string;
    description?: string;
    categoryId?: string;
    variations: ItemVariation[];
    imageIds?: string[];
  };
}

export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageData, setImageData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogData();
  }, []);

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

  async function fetchCatalogData() {
    try {
      setLoading(true);
      const response = await fetch('/api/square/catalog');
      if (!response.ok) throw new Error('Failed to fetch catalog');
      
      const data = await response.json();
      
      // Process categories
      const categoryItems = data.filter((item: any) => item.type === 'CATEGORY');
      const processedCategories: Category[] = categoryItems.map((cat: any) => ({
        id: cat.id,
        name: cat.categoryData.name,
        itemCount: 0
      }));
      
      // Process items
      const catalogItems = data.filter((item: any) => item.type === 'ITEM');
      setItems(catalogItems);

      // Update category item counts
      const categoryCounts = catalogItems.reduce((acc: Record<string, number>, item: CatalogItem) => {
        if (item.itemData.categoryId) {
          acc[item.itemData.categoryId] = (acc[item.itemData.categoryId] || 0) + 1;
        }
        return acc;
      }, {});

      const updatedCategories = processedCategories.map(cat => ({
        ...cat,
        itemCount: categoryCounts[cat.id] || 0
      }));

      // Add "All Menu" category
      setCategories([
        { id: 'all', name: 'All Menu', itemCount: catalogItems.length },
        ...updatedCategories
      ]);

      // Fetch images for items
      const imagePromises: Promise<[string, string | null]>[] = [];
      catalogItems.forEach((item: CatalogItem) => {
        if (item.itemData.imageIds?.length) {
          imagePromises.push(
            fetchImageUrl(item.itemData.imageIds[0])
              .then(url => [item.itemData.imageIds![0], url])
          );
        }
      });

      const imageResults = await Promise.all(imagePromises);
      const imageMap: Record<string, string> = {};
      imageResults.forEach(([id, url]) => {
        if (url) imageMap[id] = url;
      });
      setImageData(imageMap);

    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.itemData.categoryId === selectedCategory;
    const matchesSearch = item.itemData.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <Box>
      {/* Header */}
      <Box className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 4,
        borderBottom: '1px solid',
        borderColor: 'gray.200'
      })}>
        <Button variant="outlined">
          <span className="sr-only">Open menu</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      </Box>

      {/* Main Content */}
      <Box className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: '1fr',
          lg: '1fr 350px'
        },
        gap: 6,
        p: 4
      })}>
        {/* Left Side - Menu */}
        <VStack gap={6} align="stretch">
          {/* Categories */}
          <Box className={css({ 
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          })}>
            <HStack gap={2} className={css({ pb: 2 })}>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outlined'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={css({
                    whiteSpace: 'nowrap',
                    bg: selectedCategory === category.id ? 'primary.bg' : 'transparent',
                    color: selectedCategory === category.id ? 'primary.text' : 'inherit',
                    borderColor: selectedCategory === category.id ? 'primary.border' : 'gray.200',
                    _hover: {
                      bg: selectedCategory === category.id ? 'primary.bgHover' : 'gray.50',
                      borderColor: 'primary.borderHover',
                    }
                  })}
                >
                  {category.name}
                  <Badge 
                    variant="primary"
                    className={css({ ml: 2 })}
                  >
                    {category.itemCount}
                  </Badge>
                </Button>
              ))}
            </HStack>
          </Box>

          {/* Search */}
          <Box className={css({ position: 'relative' })}>
            <input
              type="text"
              placeholder="Search something sweet on your mind..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className={css({ 
                width: '100%',
                p: 2,
                pl: 10,
                border: '1px solid',
                borderColor: 'gray.200',
                borderRadius: 'md',
                _focus: {
                  outline: 'none',
                  borderColor: 'primary.border',
                  boxShadow: '0 0 0 1px var(--colors-primary-border)'
                }
              })}
            />
            <Box className={css({
              position: 'absolute',
              left: 3,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'gray.500'
            })}>
              <Search size={20} />
            </Box>
          </Box>

          {/* Items Grid */}
          <Box className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 4
          })}>
            {filteredItems.map(item => (
              <Box
                key={item.id}
                className={css({
                  p: 4,
                  borderRadius: 'md',
                  border: '1px solid',
                  borderColor: 'gray.200',
                  cursor: 'pointer',
                  _hover: { borderColor: 'primary.border' }
                })}
              >
                {item.itemData.imageIds?.[0] && imageData[item.itemData.imageIds[0]] && (
                  <Box className={css({
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '100%',
                    mb: 3
                  })}>
                    <Image
                      src={imageData[item.itemData.imageIds[0]]}
                      alt={item.itemData.name}
                      fill
                      className={css({
                        objectFit: 'cover',
                        borderRadius: 'md',
                      })}
                    />
                  </Box>
                )}
                <Box className={css({
                  fontWeight: 'medium',
                  fontSize: 'lg',
                  mb: 2
                })}>
                  {item.itemData.name}
                </Box>
                {item.itemData.variations?.[0]?.priceMoney && (
                  <Box className={css({
                    fontWeight: 'semibold',
                    fontSize: 'xl',
                    color: 'primary.text'
                  })}>
                    {formatPrice(
                      item.itemData.variations[0].priceMoney.amount,
                      item.itemData.variations[0].priceMoney.currency
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </VStack>

        {/* Right Side - Order Summary */}
        <Box className={css({
          position: { base: 'fixed', lg: 'sticky' },
          bottom: { base: 0, lg: 'auto' },
          top: { lg: 4 },
          right: { base: 0, lg: 'auto' },
          width: { base: '100%', lg: 'auto' },
          bg: 'white',
          p: 4,
          borderTop: { base: '1px solid', lg: 'none' },
          borderColor: 'gray.200',
          borderRadius: { lg: 'md' },
          boxShadow: 'md'
        })}>
          <VStack gap={4} align="stretch">
            <Box className={css({
              fontSize: 'sm',
              color: 'gray.500'
            })}>
              Order Number: #000
            </Box>
            
            <Box className={css({
              flex: 1,
              minHeight: '200px',
              textAlign: 'center',
              color: 'gray.500'
            })}>
              No items selected
            </Box>

            <VStack gap={2} align="stretch">
              <Box className={css({
                display: 'flex',
                justifyContent: 'space-between'
              })}>
                <Box>Subtotal</Box>
                <Box>$0.00</Box>
              </Box>
              <Box className={css({
                display: 'flex',
                justifyContent: 'space-between'
              })}>
                <Box>Tax (10%)</Box>
                <Box>$0.00</Box>
              </Box>
              <Box className={css({
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold'
              })}>
                <Box>Total</Box>
                <Box>$0.00</Box>
              </Box>
            </VStack>

            <Button variant="outlined" size="lg">
              Payment Method
            </Button>
            <Button variant="primary" size="lg">
              Place Order
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
} 