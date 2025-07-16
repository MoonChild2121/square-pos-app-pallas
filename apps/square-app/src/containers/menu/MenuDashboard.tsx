'use client'

import { useState, useMemo, useCallback, useEffect, memo } from 'react'
import { MenuLayout } from '@/components/menu/MenuLayout'
import { Utensils } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams, useRouter } from 'next/navigation'

interface InitialData {
  catalog: any[]
  taxes: any[]
  discounts: any[]
  images: Record<string, string>
}

interface MenuDashboardProps {
  initialData: InitialData
}

interface Product {
  id: string
  name: string
  price: {
    amount: number
    currency: string
  }
  imageUrl: string
  taxIds: string[]
}

// Memoize MenuLayout to prevent unnecessary re-renders
const MemoizedMenuLayout = memo(MenuLayout)

export function MenuDashboard({ initialData }: MenuDashboardProps) {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { items = [], imageData = {} } = useCatalog({
    initialData: {
      items: initialData.catalog,
      taxes: initialData.taxes,
      discounts: initialData.discounts,
      images: initialData.images
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
          
          const itemImageId = item.itemData.imageIds?.[0]
          const variationImageId = variation.itemVariationData.imageIds?.[0]
          const imageUrl = imageData[variationImageId || ''] || imageData[itemImageId || ''] || '/placeholder-image.jpg'

          return {
            id: variation.id,
            name: variation.itemVariationData.name || '',
            price: variation.itemVariationData.priceMoney,
            imageUrl,
            taxIds: item.itemData.taxIds || []
          } as Product
        }).filter((variant): variant is Product => variant !== null) // Type guard to remove nulls
      })
      .filter(variant =>
        !searchTerm ||
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [items, selectedItem, imageData, searchTerm]) as Product[]

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
      loading={false}
      products={productVariants}
    />
  )
} 