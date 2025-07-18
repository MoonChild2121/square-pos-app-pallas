'use client'

import { useState, useMemo, useCallback, useEffect, memo } from 'react'
import { MenuLayout } from '@/components/composites/menu/MenuLayout'
import { Utensils } from 'lucide-react'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { useSearchCatalog } from '@/shared/hooks/useSearchCatalog'
import { useCart } from '@/shared/contexts/CartContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/shared/types/base'
import { MenuDashboardProps } from '@/shared/types/menu'

const MemoizedMenuLayout = memo(MenuLayout)

export function MenuDashboard({ initialData }: MenuDashboardProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // The useCatalog hook now returns clean data and loading state
  const {
    products: allProducts,
    isLoading: isCatalogLoading
  } = useCatalog({
    // The initialData prop is now passed directly to the hook,
    // as it's already in the correct `CatalogData` format.
    initialData,
  });

  const { 
    products: searchedProducts, 
    isLoading: isSearchLoading 
  } = useSearchCatalog(searchTerm);

  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()

  const shouldClearCart = useMemo(() => searchParams.get('clear') === 'true', [searchParams])

  useEffect(() => {
    if (shouldClearCart) {
      clearCart()
      router.replace('/menu')
    }
  }, [shouldClearCart, clearCart, router])

  // Derive category menu items from the full product list
  const menuItems = useMemo(() => {
    const categories = new Map<string, { label: string; count: number }>();

    allProducts.forEach(product => {
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
    if (searchTerm) {
      return searchedProducts;
    }
    if (selectedItem === 'all') {
      return allProducts;
    }
    return allProducts.filter(p => p.categoryId === selectedItem);
  }, [searchTerm, selectedItem, allProducts, searchedProducts]);


  const handleSelectItem = useCallback((id: string) => {
    setSelectedItem(id)
  }, [])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  return (
    <MemoizedMenuLayout
      menuItems={menuItems}
      selectedItem={selectedItem}
      onSelectItem={handleSelectItem}
      onSearch={handleSearch}
      loading={isCatalogLoading || isSearchLoading}
      products={products}
    />
  )
}