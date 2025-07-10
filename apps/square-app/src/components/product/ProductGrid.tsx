'use client'

import { memo, useCallback } from 'react'
import { Grid } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { useCartActions } from '@/contexts/CartContext'
import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string
  name: string
  price: {
    amount: number
    currency: string
  }
  imageUrl?: string
  taxIds?: string[]
}

interface ProductGridProps {
  products: Product[]
}

// Memoized product card wrapper
const MemoizedProductCard = memo(function MemoizedProductCard({
  product,
  onAddToCart
}: {
  product: Product
  onAddToCart: (product: Product) => void
}) {
  const handleClick = useCallback(() => {
    onAddToCart(product)
  }, [product, onAddToCart])

  return (
    <ProductCard
      name={product.name}
      price={convertPrice(product.price)}
      imageUrl={product.imageUrl}
      onClick={handleClick}
    />
  )
})

// Price conversion utility
const convertPrice = (price: { amount: number; currency: string }): number => {
  return price.amount / 100 // Convert cents to dollars
}

const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCartActions()

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: convertPrice(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
      taxIds: product.taxIds
    })
  }, [addItem])

  return (
    <Grid
      className={css({
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '4',
        p: '4',
        w: '100%',
        overflowY: 'auto',
        scrollbarGutter: 'stable',
      })}
    >
      {products.map((product) => (
        <MemoizedProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </Grid>
  )
})

export default ProductGrid

