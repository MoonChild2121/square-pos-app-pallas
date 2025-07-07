// @styled-system/recipes/cartItem.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const cartItem = defineSlotRecipe({
  className: 'cartItem',
  description: 'Multi-part styles for a cart item component',
  slots: ['root', 'image', 'content', 'title', 'modifier', 'controls', 'button'],
  base: {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '4',
      bg: 'primary.bg',
      borderRadius: 'xl',
      p: '3',
    },
    image: {
      borderRadius: 'xl',
      p: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '70px',
      height: '70px',
      flexShrink: 0,
      bg: 'gray.50',
    },
    content: {
      maxW: '140px',
      w: '100%',
      flexShrink: 0,
      alignItems: 'flex-start',
      gap: '1',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    modifier: {
      color: 'gray.600',
    },
    controls: {
      px: '2',
      py: '1',
      borderRadius: 'full',
      gap: '2',
      display: 'flex',
      alignItems: 'center',
      bg: 'gray.100',
    },
    button: {
      color: 'bgSolid.text',
      bg: 'primary',
      borderRadius: 'full',
      p: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
  },
})
