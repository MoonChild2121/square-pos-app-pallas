'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { MenuLayout } from '@/components/menu/MenuLayout'
import { Utensils } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams } from 'next/navigation'

export function MenuDashboard() {
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { items, imageData } = useCatalog()
  const { clearCart } = useCart()
  const searchParams = useSearchParams()

  // Clear cart if navigating from order confirmation
  useEffect(() => {
    if (searchParams.get('clear') === 'true') {
      clearCart()
    }
  }, [clearCart, searchParams])

  const menuItems = useMemo(() => [
    {
      id: 'all',
      label: 'All Menu',
      count: items.reduce((total, item) => total + item.itemData.variations.length, 0),
      icon: <Utensils size={20} />,
    },
    ...items.map(item => ({
      id: item.id,
      label: item.itemData.name,
      count: item.itemData.variations.length,
      icon: <Utensils size={20} />,
    }))
  ], [items])

  const productVariants = useMemo(() => {
    return items
      .filter(item => selectedItem === 'all' || item.id === selectedItem)
      .flatMap(item =>
        item.itemData.variations.map(variation => {
          const itemImageId = item.itemData.imageIds?.[0]
          const variationImageId = variation.itemVariationData.imageIds?.[0]
          const imageUrl = imageData[variationImageId || ''] || imageData[itemImageId || ''] || '/placeholder-image.jpg'

          return {
            id: variation.id,
            name: variation.itemVariationData.name,
            price: variation.itemVariationData.priceMoney,
            imageUrl,
            taxIds: item.itemData.taxIds
          }
        })
      )
      .filter(variant =>
        searchTerm === '' ||
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [items, selectedItem, imageData, searchTerm])

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItem(id)
  }, [])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  return (
    <MenuLayout
      menuItems={menuItems}
      selectedItem={selectedItem}
      onSelectItem={handleSelectItem}
      onSearch={handleSearch}
      loading={false}
      products={productVariants}
    />
  )
} 