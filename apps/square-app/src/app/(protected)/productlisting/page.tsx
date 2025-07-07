'use client'

import { useState, useEffect, useMemo } from 'react'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { SidebarToggle } from '@/components/SidebarToggle'
import { Sidebar } from '@/components/Sidebar'
import ProductGrid from '@/components/ProductGrid'
import MenuBoxGrid from '@/components/MenuBoxGrid'
import { Utensils } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import Cart from '@/components/Cart'

interface Category {
  id: string;
  type: string;
  categoryData: {
    name: string;
  };
}

interface ItemVariation {
  id: string;
  itemVariationData: {
    name: string;
    priceMoney: {
      amount: number;
      currency: string;
    };
    imageIds?: string[];
  };
}

interface CatalogItem {
  id: string;
  type: string;
  itemData: {
    name: string;
    categoryId?: string;
    variations: ItemVariation[];
    imageIds?: string[];
  };
}

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [items, setItems] = useState<CatalogItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [imageData, setImageData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCatalogData()
  }, [])

  async function fetchImageUrl(imageId: string) {
    try {
      const response = await fetch(`/api/square/image/${imageId}`)
      if (!response.ok) throw new Error('Failed to fetch image')
      const data = await response.json()
      return data.url
    } catch (err) {
      return null
    }
  }

  async function fetchCatalogData() {
    try {
      setLoading(true)
      const response = await fetch('/api/square/catalog')
      if (!response.ok) throw new Error('Failed to fetch catalog')
      
      const data = await response.json()
      
      // Process items
      const catalogItems = data.filter((item: any) => item.type === 'ITEM')
      setItems(catalogItems)

      // Fetch images for items and variations
      const imagePromises: Promise<[string, string | null]>[] = []
      catalogItems.forEach((item: CatalogItem) => {
        // Get images from both item and its variations
        const imageIds = [
          ...(item.itemData.imageIds || []),
          ...item.itemData.variations.flatMap(v => v.itemVariationData.imageIds || [])
        ]
        
        imageIds.forEach(imageId => {
          imagePromises.push(
            fetchImageUrl(imageId)
              .then(url => [imageId, url])
          )
        })
      })

      const imageResults = await Promise.all(imagePromises)
      const imageMap: Record<string, string> = {}
      imageResults.forEach(([id, url]) => {
        if (url) imageMap[id] = url
      })
      setImageData(imageMap)

    } catch (err) {
      console.error('Failed to load catalog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Process menu items for MenuBoxGrid
  const menuItems = [
    { 
      id: 'all', 
      label: 'All Menu', 
      count: items.reduce((total, item) => total + item.itemData.variations.length, 0),
      icon: <Utensils size={20} /> 
    },
    ...items.map(item => ({
      id: item.id,
      label: item.itemData.name,
      count: item.itemData.variations.length,
      icon: <Utensils size={20} />
    }))
  ]

  // Get all variants for the selected item or all items, filtered by search term
  const productVariants = useMemo(() => {
    return items
      .filter(item => selectedItem === 'all' || item.id === selectedItem)
      .flatMap(item => 
        item.itemData.variations.map(variation => {
          const itemImageId = item.itemData.imageIds?.[0]
          const variationImageId = variation.itemVariationData.imageIds?.[0]
          const imageUrl = (variationImageId && imageData[variationImageId]) || 
                          (itemImageId && imageData[itemImageId]) || 
                          '/placeholder-image.jpg'
          
          return {
            id: variation.id,
            name: variation.itemVariationData.name,
            price: variation.itemVariationData.priceMoney,
            imageUrl: imageUrl
          }
        })
      )
      .filter(variant => 
        searchTerm === '' || 
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [items, selectedItem, imageData, searchTerm])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {isSidebarOpen && (
        <Sidebar
          avatarUrl="https://github.com/nanopx.png"
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <SidebarToggle 
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen} 
      />

      <Flex
        w="100%"
        h="100vh"
        className={css({
          overflow: 'hidden',
        })}
      >
        {/* Main content area */}
        <Flex
          direction="column"
          className={css({
            flex: '1',
            minWidth: 0,
            height: '100vh',
            p: '4',
            gap: '4',
          })}
        >
          {/* Fixed header section */}
          <Flex
            direction="column"
            className={css({
              gap: '4',
            })}
          >
            <MenuBoxGrid
              items={menuItems}
              selectedCategory={selectedItem}
              onCategorySelect={setSelectedItem}
            />
            <Box className={css({
              width: '100%',
            })}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          </Flex>

          {/* Scrollable products section */}
          <Box
            className={css({
              flex: '1',
              overflowY: 'auto',
              minHeight: 0,
              pr: '2',
            })}
          >
            <ProductGrid products={productVariants} />
          </Box>
        </Flex>

        {/* Cart section */}
        <Box
          w="400px"
          className={css({
            p: '4',
            bg: 'fill.secondary',
            borderRadius: 'lg',
            boxShadow: 'sm',
            height: '100%',
          })}
        >
          <Cart />
        </Box>
      </Flex>
    </>
  )
}
