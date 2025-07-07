'use client'

import { Box } from '@styled-system/jsx'
import { productCard } from '@styled-system/recipes'

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  onClick?: () => void
}

export default function ProductCard({ name, price, imageUrl, onClick }: ProductCardProps) {
  const { root, image, name: nameStyle, price: priceStyle } = productCard()

  return (
    <Box onClick={onClick} className={root}>
      <Box className={image}>
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
      <Box>
        <Box className={nameStyle}>{name}</Box>
        <Box className={priceStyle}>${price.toFixed(2)}</Box>
      </Box>
    </Box>
  )
}
