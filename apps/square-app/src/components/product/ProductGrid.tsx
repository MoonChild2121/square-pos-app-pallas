'use client'

import { memo, useCallback } from 'react'
import { Grid } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { useCartActions } from '@/shared/contexts/CartContext'
import ProductCard from '@/components/product/ProductCard'
import { Product, ProductGridProps } from '@/shared/types/product'

const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCartActions()

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price.amount / 100,
      quantity: 1,
      imageUrl: product.imageUrl,
      taxIds: product.taxIds,
      selectedModifier: product.modifiers?.[0] ? {
        id: product.modifiers[0].id,
        name: product.modifiers[0].name,
        price: product.modifiers[0].priceMoney.amount / 100
      } : undefined
    })
  }, [addItem])

  return (
    <Grid
      className={css({
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'gap.inline.sm',
        p: 'padding.block.sm',
        w: '100%',
        overflowY: 'auto',
        scrollbarGutter: 'stable',
      })}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          taxIds={product.taxIds}
          modifiers={product.modifiers}
        />
      ))}
    </Grid>
  )
})

export default ProductGrid

