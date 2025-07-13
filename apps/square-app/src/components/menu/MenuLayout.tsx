'use client'

import { memo, useState } from 'react'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { Header } from '@/components/layout/Header'
import MenuBoxGrid from '@/components/menu/MenuBoxGrid'
import ProductGrid from '@/components/product/ProductGrid'
import SearchBar from '@/components/SearchBar'
import Cart from '@/components/cart/Cart'
import { CartToggle } from '@/components/cart/CartToggle'

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
  const [isCartOpen, setIsCartOpen] = useState(false)

  if (loading) return <div>Loading...</div>

  return (
    <Flex w="100%" h="100vh" className={css({ overflow: 'hidden' })}>
      {/* Main */}
      <Flex direction="column" flex="1" className={css({ 
        p: '4', 
        gap: '4',
        maxW: { base: '100%', lg: isCartOpen ? 'calc(100% - 400px)' : '100%' },
        transition: 'max-width 0.3s ease-in-out',
      })}>
        <Header />
        <MenuSection
          menuItems={menuItems}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onSearch={onSearch}
        />
        <ProductSection products={products} />
      </Flex>

      {/* Cart Toggle Button */}
      <CartToggle isOpen={isCartOpen} onToggle={() => setIsCartOpen(!isCartOpen)} />

      {/* Cart */}
      <Box
        className={css({
          position: { base: 'fixed', lg: 'relative' },
          top: { base: 0, lg: 'auto' },
          right: { base: 0, lg: 'auto' },
          bottom: { base: 0, lg: 'auto' },
          w: { base: '100%', md: '400px' },
          maxW: '100%',
          p: '4',
          bg: 'surface.container',
          borderRadius: { base: 'lg lg 0 0', lg: 'lg' },
          boxShadow: 'lg',
          height: '100%',
          transform: {
            base: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
            lg: 'none'
          },
          transition: 'transform 0.3s ease-in-out',
          zIndex: { base: 40, lg: 'auto' },
          overflowY: 'auto',
        })}
      >
        <Cart />
      </Box>
    </Flex>
  )
}) 