// @styled-system/recipes/productCard.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const productCard = defineSlotRecipe({
  className: 'productCard',
  description: 'Product card with image, name, and price slots',
  slots: ['root', 'image', 'nameContainer', 'name', 'price'],
  base: {
    root: {
      cursor: 'pointer',
      borderRadius: 'xl',
      bg: 'bgSolid.text',
      boxShadow: 'md',
      pt: '2',
      transition: 'transform 0.2s ease-in-out',
      _hover: {
        transform: 'scale(1.02)',
      },
    },
    image: {
      borderRadius: 'xl',
      p: '1', // reduced padding
      aspectRatio: '4/3', // was '1'; now image height is reduced
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nameContainer: {
      borderRadius: '0 0 10px 10px',
      p: '2',
      bg: 'fill.secondary',
    },
    name: {
      fontSize: 'md',
      fontWeight: 'medium',
      mb: '1',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    price: {
      fontSize: 'md',
      fontWeight: 'bold',
    },
  },
})
