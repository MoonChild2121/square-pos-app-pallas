'use client';

import { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { Flex, Box } from '@styled-system/jsx';
import { css } from '@styled-system/css';
import Utensils from 'lucide-react/dist/esm/icons/utensils';
import MenuBoxGrid from '@/components/composites/menu/MenuBoxGrid';
import ProductGrid from '@/components/composites/product/ProductGrid';
import SearchBar from '@/components/composites/productSearch/SearchBar';
import { useCatalog } from '@/shared/hooks/useCatalog';
import { useSearchCatalog } from '@/shared/hooks/useSearchCatalog';
import { useCartStore } from '@/shared/stores/useCartStore';
import { useSearchParams, useRouter } from 'next/navigation';

// Memoized menu section component
const MenuSection = memo(function MenuSection({
  menuItems,
  selectedItem,
  onSelectItem,
  onSearch,
}: {
  menuItems: any[];
  selectedItem: string;
  onSelectItem: (id: string) => void;
  onSearch: (term: string) => void;
}) {
  return (
    <Flex direction="column" gap="layout.section.sm">
      <MenuBoxGrid
        items={menuItems}
        selectedCategory={selectedItem}
        onCategorySelect={onSelectItem}
      />
      <Box w="100%">
        <SearchBar onSearch={onSearch} />
      </Box>
    </Flex>
  );
});

// Memoized product section component
const ProductSection = memo(function ProductSection({
  products,
  loading,
}: {
  products: any[];
  loading: boolean;
}) {
  return (
    <Box
      className={css({
        flex: '1',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      })}
    >
      <ProductGrid products={products} loading={loading} />
    </Box>
  );
});

export const CatalogUI = memo(function CatalogUI({ initialData }: { initialData: any }) {
  const [selectedItem, setSelectedItem] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // The useCatalog hook returns clean data and loading state
  const { products: allProducts, isLoading: isCatalogLoading } = useCatalog({
    initialData,
  });

  const { products: searchedProducts, isLoading: isSearchLoading } = useSearchCatalog(searchTerm);

  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const shouldClearCart = useMemo(() => searchParams.get('clear') === 'true', [searchParams]);

  useEffect(() => {
    if (shouldClearCart) {
      clearCart();
      router.replace('/home');
    }
  }, [shouldClearCart, clearCart, router]);

  // Derive category menu items from the full product list
  const menuItems = useMemo(() => {
    const categories = new Map<string, { label: string; count: number }>();

    allProducts.forEach((product) => {
      if (product.categoryId && product.categoryName) {
        if (!categories.has(product.categoryId)) {
          categories.set(product.categoryId, {
            label: product.categoryName,
            count: 0,
          });
        }
        categories.get(product.categoryId)!.count++;
      }
    });

    const categoryItems = Array.from(categories.entries()).map(([id, { label, count }]) => ({
      id,
      label,
      count,
      icon: <Utensils size={20} />,
    }));

    return [
      {
        id: 'all',
        label: 'All Menu',
        count: allProducts.length,
        icon: <Utensils size={20} />,
      },
      ...categoryItems,
    ];
  }, [allProducts]);

  // The products to display are either the search results or the filtered catalog
  const products = useMemo(() => {
    const productsToFilter = searchTerm ? searchedProducts : allProducts;

    if (selectedItem === 'all') {
      return productsToFilter;
    }

    return productsToFilter.filter((p) => p.categoryId === selectedItem);
  }, [searchTerm, selectedItem, allProducts, searchedProducts]);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItem(id);
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <Box
      className={css({
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: 'layout.section.sm',
        h: '100%',
        minHeight: 0,
      })}
    >
      <MenuSection
        menuItems={menuItems}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
        onSearch={handleSearch}
      />
      <ProductSection products={products} loading={isCatalogLoading || isSearchLoading} />
    </Box>
  );
});
