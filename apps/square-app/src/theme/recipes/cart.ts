// @styled-system/recipes/cartItem.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const cartItem = defineSlotRecipe({
  className: 'cartItem',
  description: 'Multi-part styles for a cart item component',
  slots: ['root', 'image', 'content', 'title', 'modifier', 'controls', 'button', 'deleteButton', 'contentWrapper'],
  base: {
    root: {
      display: 'flex',
      gap: '3',
      bg: 'surface.layout',
      p: '2.5',
      borderRadius: 'lg',
      borderColor: 'primary.emphasized',
      w: '100%',
      position: 'relative',
      minH: '90px',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      flex: 1,
      justifyContent: 'space-between',
    },
    image: {
      p: '1',
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
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 'sm',
      fontWeight: 'medium',
    },
    modifier: {
    },
    controls: {
      px: '1',
      py: '0.5',
      borderRadius: 'full',
      gap: '1',
      display: 'flex',
      alignItems: 'center',
      bg: 'fill.secondary',
      alignSelf: 'flex-end',
      fontSize: 'sm',
    },
    button: {
      color: 'fill',
      bg: 'bgSolid.text',
      borderRadius: 'full',
      p: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      _hover: {
        bg: 'fill.secondary',
      }
    },
    deleteButton: {
      color: 'text.secondary',
      borderRadius: 'full',
      p: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'absolute',
      top: '2',
      right: '2',
      _hover: {
        transform: 'scale(1.1)',
      }
    }
  },
})

export const cartContainer = defineSlotRecipe({
  className: 'cartContainer',
  description: 'Styles for the cart container and header',
  slots: ['root', 'header', 'itemsList', 'footer', 'summary'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      h: '100%',
      gap: '4',
    },
    header: {
      borderBottom: '1px solid',
      borderColor: 'surface.container.highest',
      pb: '3',
    },
    itemsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      flex: '1',
      overflowY: 'auto',
      pr: '1',
    },
    summary: {
      borderTop: '1px solid',
      borderColor: 'surface.container.highest',
      pt: '4',
      pb: '4',
      px: '4',
      bg: 'bgSolid.text',
      '&.loading': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minH: '120px',
      },
      '&.error': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minH: '120px',
        bg: 'error.subtle',
      }
    },
    footer: {
      pt: '4',
      borderTop: '1px solid',
      borderColor: 'surface.container.highest',
    }
  }
})
