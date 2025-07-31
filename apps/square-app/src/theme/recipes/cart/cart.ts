// @styled-system/recipes/cartItem.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const cartItem = defineSlotRecipe({
  className: 'cartItem',
  description: 'Multi-part styles for a cart item component',
  slots: ['root', 'image', 'content', 'title', 'controls', 'button', 'deleteButton', 'contentWrapper'],
  base: {
    root: {
      bg: 'bgSolid.text',
      borderRadius: 'xl',
      border: '1px solid',
      borderColor: 'border.secondary',
      boxShadow: 'sm',
      p: 'padding.inline.sm',
      w: '100%',
      position: 'relative',
    },
    image: {
      position: 'relative',       // Required for Next.js Image fill to work
      width: '80px',          // Fixed container size
      height: '80px',
      flexShrink: 0,
      bg: 'surface.layout',
      borderRadius: 'lg',
      overflow: 'hidden',         // Clip overflow for clean edges
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',          
    },
    content: {
      maxW: 'calc(100% - 40px)', // Space for delete button
      overflow: 'hidden',
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 'sm',
      fontWeight: 'medium',
    },
    controls: {
      px: 'padding.inline.sm',
      py: 'padding.block.sm',
      borderRadius: 'full',
      gap: 'gap.inline.sm',
      display: 'flex',
      alignItems: 'center',
      bg: 'fill.secondary',
      alignSelf: 'flex-end',
    },
    button: {
      color: 'primary.bg',
      bg: 'primary',
      borderRadius: 'full',
      p: 'padding.block.sm',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      _hover: {
        bg: 'primary.hover',
      }
    },
    deleteButton: {
      color: 'text.secondary',
      borderRadius: 'full',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'absolute',
      top: 'padding.inline.sm',
      right: 'padding.inline.sm',
      _hover: {
        transform: 'scale(1.1)',
      }
    }
  },
})
