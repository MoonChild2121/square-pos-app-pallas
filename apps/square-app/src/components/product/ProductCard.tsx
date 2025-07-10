'use client'

import { memo, useMemo } from 'react'
import { Box } from '@styled-system/jsx'
import { productCard } from '@styled-system/recipes'

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  onClick?: () => void
}

const ProductCard = memo(function ProductCard({ 
  name, 
  price, 
  imageUrl, 
  onClick 
}: ProductCardProps) {
  const styles = useMemo(() => productCard(), [])
  
  return (
    <Box onClick={onClick} className={styles.root}>
      <Box className={styles.image}>
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box className={styles.nameContainer}>  
        <Box className={styles.name}>{name}</Box>
        <Box className={styles.price}>${price.toFixed(2)}</Box>
      </Box>
    </Box>
  )
})

export default ProductCard
