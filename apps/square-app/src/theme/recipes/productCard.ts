// @styled-system/recipes/productCard.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const productCard = defineSlotRecipe({
  className: 'productCard',
  description: 'Product card with image, name, and price slots',
  slots: ['root', 'image', 'name', 'price'],
  base: {
    root: {
      cursor: 'pointer',
      borderRadius: 'xl',
      bg: 'primary.bg',
      border: '1px solid',
      borderColor: 'primary.border',
      p: '3',
      transition: 'transform 0.2s ease-in-out',
      _hover: {
        transform: 'scale(1.02)',
      },
    },
    image: {
      bg: 'gray.50',
      borderRadius: 'xl',
      p: '2',
      mb: '2',
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: 'sm',
      fontWeight: 'medium',
      mb: '1',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    price: {
      fontSize: 'sm',
    },
  },
})
