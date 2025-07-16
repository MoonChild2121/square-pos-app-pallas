'use client'

import { memo, useState } from 'react'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { Header } from '@/components/layout/Header'
import MenuBoxGrid from '@/components/menu/MenuBoxGrid'
import ProductGrid from '@/components/product/ProductGrid'
import SearchBar from '@/components/search/SearchBar'
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
      <ProductSection products={products} />
    </Flex>

    {/*Overlay - place AFTER content but BEFORE Cart */}
    {isCartOpen && (
      <Box
        className={css({
          position: 'fixed',
          inset: 0,
          bg: 'fill', 
          zIndex: 40,
          transition: 'opacity 0.3s ease-in-out',
        })}
        onClick={() => setIsCartOpen(false)}
      />
    )}

    {/* Cart must have higher z-index */}
    <CartToggle isOpen={isCartOpen} onToggle={() => setIsCartOpen(!isCartOpen)} />

    <Box
      className={css({
        position: 'fixed',
        top: 0,
        right: 0,
        h: '100%',
        w: { base: '100%', md: '400px' },
        bg: 'white',
        zIndex: 50, // higher than overlay
        transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: 'lg',
      })}
    >
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Box>
  </Box>
)

}) 