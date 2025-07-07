'use client'

import { Grid } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import ModifierModal from '../ModifierModal'
import ProductCard from '@/components/product/ProductCard'

interface Modifier {
  id: string
  name: string
  price: number
}

interface Product {
  id: string
  name: string
  price: {
    amount: number
    currency: string
  }
  imageUrl?: string
  modifiers?: Modifier[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModifierModalOpen, setIsModifierModalOpen] = useState(false)

  const convertPrice = (price: { amount: number; currency: string }): number => {
    return price.amount / 100 // Convert cents to dollars
  }

  const handleProductClick = (product: Product) => {
    if (product.modifiers && product.modifiers.length > 0) {
      setSelectedProduct(product)
      setIsModifierModalOpen(true)
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: convertPrice(product.price),
        quantity: 1,
        imageUrl: product.imageUrl,
      })
    }
  }

  const handleModifierSelect = (modifier: Modifier) => {
    if (selectedProduct) {
      addItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: convertPrice(selectedProduct.price),
        quantity: 1,
        imageUrl: selectedProduct.imageUrl,
        selectedModifier: {
          id: modifier.id,
          name: modifier.name,
          price: modifier.price,
        },
      })
    }
  }

  return (
    <>
      <Grid
      className={css({
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '4',
          p: '4',
        w: '100%',
          overflowY: 'auto',
      })}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
            price={convertPrice(product.price)}
          imageUrl={product.imageUrl}
            onClick={() => handleProductClick(product)}
        />
      ))}
      </Grid>

      {selectedProduct && (
        <ModifierModal
          isOpen={isModifierModalOpen}
          onClose={() => {
            setIsModifierModalOpen(false)
            setSelectedProduct(null)
          }}
          modifiers={selectedProduct.modifiers || []}
          onSelect={handleModifierSelect}
          productName={selectedProduct.name}
        />
      )}
    </>
  )
}

