'use client'

import { memo } from 'react'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { Header } from '@/components/layout/Header'
import MenuBoxGrid from '@/components/menu/MenuBoxGrid'
import ProductGrid from '@/components/product/ProductGrid'
import SearchBar from '@/components/SearchBar'
import Cart from '@/components/cart/Cart'

interface Product {
  id: string
  name: string
  price: { amount: number; currency: string }
  imageUrl: string
  taxIds?: string[]
}

interface MenuItem {
  id: string
  label: string
  count: number
  icon: React.ReactNode
}

interface Props {
  menuItems: MenuItem[]
  selectedItem: string
  onSelectItem: (id: string) => void
  onSearch: (term: string) => void
  loading: boolean
  products: Product[]
}

// Memoized menu section component
const MenuSection = memo(function MenuSection({
  menuItems,
  selectedItem,
  onSelectItem,
  onSearch
}: Pick<Props, 'menuItems' | 'selectedItem' | 'onSelectItem' | 'onSearch'>) {
  return (
    <Flex direction="column" className={css({ gap: '4' })}>
      <MenuBoxGrid
        items={menuItems}
        selectedCategory={selectedItem}
        onCategorySelect={onSelectItem}
      />
      <Box w="100%">
        <SearchBar onSearch={onSearch} />
      </Box>
    </Flex>
  )
})

// Memoized product section component
const ProductSection = memo(function ProductSection({
  products
}: Pick<Props, 'products'>) {
  return (
    <Box
      className={css({
        flex: '1',
        overflowY: 'auto',
        minHeight: 0,
        pr: '2',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      })}
    >
      <ProductGrid products={products} />
    </Box>
  )
})

export const MenuLayout = memo(function MenuLayout({
  menuItems,
  selectedItem,
  onSelectItem,
  onSearch,
  loading,
  products,
}: Props) {
  if (loading) return <div>Loading...</div>

  return (
    <Flex w="100%" h="100vh" className={css({ overflow: 'hidden' })}>
      {/* Main */}
      <Flex direction="column" flex="1" className={css({ p: '4', gap: '4' })}>
        <Header />
        <MenuSection
          menuItems={menuItems}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onSearch={onSearch}
        />
        <ProductSection products={products} />
      </Flex>

      {/* Cart */}
      <Box
        w="400px"
        className={css({
          p: '4',
          bg: 'surface.container',
          borderRadius: 'lg',
          boxShadow: 'lg',
          height: '100%',
        })}
      >
        <Cart />
      </Box>
    </Flex>
  )
}) 