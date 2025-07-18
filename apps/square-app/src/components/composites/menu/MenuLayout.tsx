'use client'

import { memo, useState } from 'react'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { cartOverlay, cartSlideout } from '@styled-system/recipes'
import { Header } from '@/components/composites/layout/Header'
import MenuBoxGrid from '@/components/composites/menu/MenuBoxGrid'
import ProductGrid from '@/components/composites/product/ProductGrid'
import SearchBar from '@/components/composites/search/SearchBar'
import { CartToggle } from '@/components/composites/cart/cart-toggle/CartToggle'
import { MenuLayoutProps } from '@/shared/types/menu'
import { CartContainer } from '@/containers/CartContainer'

// Memoized menu section component
const MenuSection = memo(function MenuSection({
  menuItems,
  selectedItem,
  onSelectItem,
  onSearch
}: Pick<MenuLayoutProps, 'menuItems' | 'selectedItem' | 'onSelectItem' | 'onSearch'>) {
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
  products,
  loading
}: Pick<MenuLayoutProps, 'products' | 'loading'>) {
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
      <ProductGrid products={products} loading={loading} />
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
}: MenuLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <Box
      position="relative"
      w="100%" 
      h="100vh" 
      className={css({ overflow: 'hidden' })}
    >
      {/* Main Content */}
      <Flex direction="column" className={css({ 
        p: '4', 
        gap: '4',
        h: '100%',
      })}>
        <Header />
        <MenuSection
          menuItems={menuItems}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onSearch={onSearch}
        />
        <ProductSection products={products} loading={loading} />
      </Flex>

      {/* Overlay - using recipe */}
      <Box
        className={cartOverlay({ isVisible: isCartOpen })}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Toggle */}
      <CartToggle isOpen={isCartOpen} onToggle={() => setIsCartOpen(!isCartOpen)} />

      {/* Cart Container - using recipe */}
      <Box className={cartSlideout({ 
        isOpen: isCartOpen, 
        size: { base: 'mobile', md: 'desktop' } 
      })}>
        <CartContainer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </Box>
    </Box>
  )
})