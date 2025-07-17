// @styled-system/recipes/cartItem.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const cartItem = defineSlotRecipe({
  className: 'cartItem',
  description: 'Multi-part styles for a cart item component',
  slots: ['root', 'image', 'content', 'title', 'controls', 'button', 'deleteButton', 'contentWrapper', 'modifierInfo'],
  base: {
    root: {
      display: 'flex',
      gap: 'gap.inline.sm',
      bg: 'surface.layout',
      p: 'padding.block.sm',
      borderRadius: 'lg',
      w: '100%',
      position: 'relative',
      minH: '90px',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'gap.inline.sm',
      flex: 1,
      justifyContent: 'space-between',
    },
    image: {
      p: 'padding.block.sm',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      flexShrink: 0,
      bg: 'white',
      borderRadius: 'md',
    },
    content: {
      maxW: 'calc(100% - 40px)', // Space for delete button
      flexGrow: 1,
      overflow: 'hidden',
      alignItems: 'flex-start',
      display: 'flex',  
      flexDirection: 'column',
      gap: 'gap.inline.sm',
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 'sm',
      fontWeight: 'medium',
    },
    modifierInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'gap.inline.sm',
      color: 'text.secondary',
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
      p: 'padding.block.sm',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'absolute',
      top: 'layout.internal.sm',
      right: 'layout.internal.sm',
      _hover: {
        transform: 'scale(1.1)',
      }
    }
  },
})
