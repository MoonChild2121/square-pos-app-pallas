'use client'

import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { SidebarToggle } from '@/components/layout/SidebarToggle'
import { Sidebar } from '@/components/layout/Sidebar'
import MenuBoxGrid from '@/components/menu/MenuBoxGrid'
import ProductGrid from '@/components/product/ProductGrid'
import SearchBar from '@/components/SearchBar'
import Cart from '@/components/cart/Cart'

interface Product {
  id: string
  name: string
  price: { amount: number; currency: string }
  imageUrl: string
}

interface MenuItem {
  id: string
  label: string
  count: number
  icon: React.ReactNode
}

interface Props {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onCloseSidebar: () => void
  menuItems: MenuItem[]
  selectedItem: string
  onSelectItem: (id: string) => void
  onSearch: (term: string) => void
  loading: boolean
  products: Product[]
}

export default function ProductListingPage({
  isSidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  menuItems,
  selectedItem,
  onSelectItem,
  onSearch,
  loading,
  products,
}: Props) {
  if (loading) return <div>Loading...</div>

  return (
    <>
      {isSidebarOpen && (
        <Sidebar
          avatarUrl="https://github.com/nanopx.png"
          onClose={onCloseSidebar}
        />
      )}
      <SidebarToggle onClick={onToggleSidebar} isSidebarOpen={isSidebarOpen} />

      <Flex w="100%" h="100vh" className={css({ overflow: 'hidden' })}>
        {/* Main */}
        <Flex direction="column" flex="1" className={css({ p: '4', gap: '4' })}>
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

          <Box
            className={css({
              flex: '1',
              overflowY: 'auto',
              minHeight: 0,
              pr: '2',
            })}
          >
            <ProductGrid products={products} />
          </Box>
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
    </>
  )
}
