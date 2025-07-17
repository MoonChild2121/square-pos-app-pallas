import { useQuery } from '@tanstack/react-query'
import { Product } from '@/shared/types/product'
import { CatalogItem, Modifier, SearchCatalogResponse } from '@/shared/types/catalog'
import { STALE_TIME, GC_TIME } from '@/shared/constants'
import JSONBig from 'json-bigint'
import { useMemo } from 'react'
import { ModifierData } from '../types/modifiers'

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  return ''
}

const fetchSearch = async (searchTerm: string): Promise<SearchCatalogResponse> => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/square/catalog/search`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords: [searchTerm] }),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`)
  }

  try {
    return JSONBig.parse(responseText)
  } catch (error) {
    throw new Error('Failed to parse search results')
  }
}

function createModifierMap(modifiers: Modifier[] = []): Record<string, ModifierData[]> {
  return modifiers.reduce((acc, modifier) => {
    const modifierData = (modifier as any).modifierData
    if (!modifierData) return acc

    const listId = modifierData.modifierListId
    if (!acc[listId]) {
      acc[listId] = []
    }
    acc[listId].push({
      ...modifierData,
      id: modifier.id,
    })
    return acc
  }, {} as Record<string, ModifierData[]>)
}

export function useSearchCatalog(searchTerm: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => fetchSearch(searchTerm),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: searchTerm.length >= 2,
  })

  const products = useMemo(() => {
    if (!data || !data.objects) {
      return []
    }

    const relatedObjects = data.relatedObjects || []

    const imageMap = relatedObjects.reduce((acc, obj) => {
      if (obj.type === 'IMAGE' && obj.imageData) {
        acc[obj.id] = (obj.imageData as any).url
      }
      return acc
    }, {} as Record<string, string>)

    const modifierMap = createModifierMap(
      relatedObjects.filter(obj => obj.type === 'MODIFIER') as Modifier[],
    )

    const getItemModifiers = (item: CatalogItem): ModifierData[] => {
      if (!item.itemData?.modifierListInfo) return []
      return item.itemData.modifierListInfo.flatMap(info => {
        return modifierMap[info.modifierListId] || []
      })
    }

    return data.objects
      .map((item): Product | null => {
        if (item.type !== 'ITEM_VARIATION' || !item.itemVariationData) {
          return null
        }

        const relatedItem = relatedObjects.find(
          obj => obj.type === 'ITEM' && obj.id === item.itemVariationData?.itemId,
        )
        if (!relatedItem || !relatedItem.itemData) return null

        const itemImageId = relatedItem.itemData.imageIds?.[0]
        const variationImageId = item.itemVariationData.imageIds?.[0]
        const imageUrl =
          imageMap[variationImageId || ''] ||
          imageMap[itemImageId || ''] ||
          '/placeholder-image.jpg'

        return {
          id: item.id,
          name: item.itemVariationData.name || '',
          price: item.itemVariationData.priceMoney,
          imageUrl,
          taxIds: relatedItem.itemData.taxIds || [],
          modifiers: getItemModifiers(relatedItem),
        }
      })
      .filter((p): p is Product => p !== null)
  }, [data])

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    products,
    isLoading,
    error,
  }), [products, isLoading, error])
}