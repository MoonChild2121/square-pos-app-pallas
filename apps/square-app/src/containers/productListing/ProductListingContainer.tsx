// containers/ProductListing/ProductListingContainer.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductListingPage from './ProductListingPage'
import { Utensils } from 'lucide-react'

interface ItemVariation {
  id: string
  itemVariationData: {
    name: string
    priceMoney: {
      amount: number
      currency: string
    }
    imageIds?: string[]
  }
}

interface CatalogItem {
  id: string
  type: string
  itemData: {
    name: string
    categoryId?: string
    variations: ItemVariation[]
    imageIds?: string[]
  }
}

const CATALOG_CACHE_KEY = 'square_app_catalog'
const CATALOG_CACHE_EXPIRY = 5 * 60 * 1000
const IMAGE_CACHE_KEY = 'square_app_images'

interface CacheData {
  timestamp: number
  data: any
}

export default function ProductListingContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [items, setItems] = useState<CatalogItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string>('all')
  const [imageData, setImageData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCatalogData()
  }, [])

  const loadCatalogData = async () => {
    const cachedCatalog = localStorage.getItem(CATALOG_CACHE_KEY)
    const cachedImages = localStorage.getItem(IMAGE_CACHE_KEY)

    if (cachedCatalog && cachedImages) {
      const catalogCache: CacheData = JSON.parse(cachedCatalog)
      const imageCache: Record<string, string> = JSON.parse(cachedImages)

      if (Date.now() - catalogCache.timestamp < CATALOG_CACHE_EXPIRY) {
        setItems(catalogCache.data)
        setImageData(imageCache)
        setLoading(false)
        return
      }
    }

    await fetchCatalogData()
  }

  async function fetchImageUrl(imageId: string) {
    try {
      const response = await fetch(`/api/square/image/${imageId}`)
      if (!response.ok) throw new Error('Failed to fetch image')
      const data = await response.json()
      return data.url
    } catch {
      return null
    }
  }

  async function fetchCatalogData() {
    try {
      setLoading(true)
      const response = await fetch('/api/square/catalog')
      if (!response.ok) throw new Error('Failed to fetch catalog')

      const data = await response.json()
      const catalogItems = data.filter((item: any) => item.type === 'ITEM')
      setItems(catalogItems)

      const catalogCache: CacheData = {
        timestamp: Date.now(),
        data: catalogItems,
      }
      localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(catalogCache))

      const imagePromises: Promise<[string, string | null]>[] = []
      catalogItems.forEach((item: CatalogItem) => {
        const imageIds = [
          ...(item.itemData.imageIds || []),
          ...item.itemData.variations.flatMap(v => v.itemVariationData.imageIds || [])
        ]
        imageIds.forEach(imageId => {
          imagePromises.push(fetchImageUrl(imageId).then(url => [imageId, url]))
        })
      })

      const imageResults = await Promise.all(imagePromises)
      const imageMap: Record<string, string> = {}
      imageResults.forEach(([id, url]) => {
        if (url) imageMap[id] = url
      })
      setImageData(imageMap)
      localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(imageMap))

    } catch (err) {
      console.error('Failed to load catalog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          }
        })
      )
      .filter(variant =>
        searchTerm === '' ||
        variant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [items, selectedItem, imageData, searchTerm])

  return (
    <ProductListingPage
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      menuItems={menuItems}
      selectedItem={selectedItem}
      onSelectItem={setSelectedItem}
      onSearch={setSearchTerm}
      loading={loading}
      products={productVariants}
    />
  )
}  