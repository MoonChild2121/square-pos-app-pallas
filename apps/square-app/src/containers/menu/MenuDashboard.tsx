'use client'

import { useState, useMemo, useCallback, useEffect, memo } from 'react'
import { MenuLayout } from '@/components/composites/menu/MenuLayout'
import { Utensils } from 'lucide-react'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { useSearchCatalog } from '@/shared/hooks/useSearchCatalog'
import { useCart } from '@/shared/contexts/CartContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/shared/types/base'
import {MenuDashboardProps} from '@/shared/types/menu'

// Memoize MenuLayout to prevent unnecessary re-renders
const MemoizedMenuLayout = memo(MenuLayout)

export function MenuDashboard({ initialData }: MenuDashboardProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { products: searchedProducts, isLoading: isSearchLoading } = useSearchCatalog(searchTerm, selectedItem === 'all' ? undefined : selectedItem)

  // Memoize the searchedProducts and isSearchLoading to avoid unnecessary re-renders
  const memoizedSearch = useMemo(() => ({
    searchedProducts,
    isSearchLoading
  }), [searchedProducts, isSearchLoading])
  
  const { items = [], imageData = {}, getItemModifiers } = useCatalog({
    initialData: {
      items: initialData.catalog,
      taxes: initialData.taxes,
      discounts: initialData.discounts,
      images: initialData.images,
      modifiers: initialData.modifiers
    }
  })
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Extract condition check to prevent unnecessary effect runs
  const shouldClearCart = useMemo(() => searchParams.get('clear') === 'true', [searchParams])

  // Clear cart if navigating from order confirmation and remove clear parameter
  useEffect(() => {
    if (shouldClearCart) {
      clearCart()
      router.replace('/menu')
    }
  }, [shouldClearCart, clearCart, router])

  const menuItems = useMemo(() => {
    if (!items?.length) return []
    
    return [
      {
        id: 'all',
        label: 'All Menu',
        count: items.reduce((total, item) => total + (item?.itemData?.variations?.length || 0), 0),
        icon: <Utensils size={20} />,
      },
      ...items.map(item => ({
        id: item?.id || '',
        label: item?.itemData?.name || '',
        count: item?.itemData?.variations?.length || 0,
        icon: <Utensils size={20} />,
      }))
    ]
  }, [items])

  const productVariants = useMemo(() => {
    if (!items?.length) return [] as Product[]
    
    return items
      .filter(item => selectedItem === 'all' || item?.id === selectedItem)
      .flatMap(item => {
        if (!item?.itemData?.variations) return [] as Product[]
        
        return item.itemData.variations.map(variation => {
          if (!variation?.itemVariationData) return null
          
          const itemImageId = item.itemData?.imageIds?.[0]
          const variationImageId = variation.itemVariationData.imageIds?.[0]
          const imageUrl = imageData[variationImageId || ''] || imageData[itemImageId || ''] || '/placeholder-image.jpg'

          return {
            id: variation.id,
            name: variation.itemVariationData.name || '',
            price: variation.itemVariationData.priceMoney,
            imageUrl,
            taxIds: item.itemData?.taxIds || [],
            modifiers: getItemModifiers(item)
          } as Product
        }).filter((variant): variant is Product => variant !== null) // Type guard to remove nulls
      })
      .filter(variant =>
        !searchTerm ||
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [items, selectedItem, imageData, searchTerm, getItemModifiers]) as Product[]

  const products = searchTerm ? memoizedSearch.searchedProducts : productVariants

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
      loading={memoizedSearch.isSearchLoading}
      products={products}
    />
  )
} 