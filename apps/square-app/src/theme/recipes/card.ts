// @styled-system/recipes/cardBox.ts
import { defineRecipe } from '@pandacss/dev'

export const cardBox = defineRecipe({
  className: 'cardBox',
  description: 'Card component with variants for menu, cart item, and order item',
  base: {
    borderRadius: 'xl',
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
  },
  variants: {
    variant: {
      menucard: {
        p: '4',
        minW: '120px',
        w: '150px',
        h: '150px',
        borderRadius: 'xl',
        boxShadow: 'md',
        transition: 'all 0.2s',
        _hover: {
          cursor: 'pointer',
          transform: 'scale(1.02)',
        },
      },
      cartitem: {
        p: '2',
        bg: 'surface.layout',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
      },
      orderitemcard: {
        p: '3',
        bg: 'surface.container.low',
        borderRadius: 'lg',
        boxShadow: 'sm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
      },
    },
    isSelected: {
      true: {
        bg: 'primary.bg',
        color: 'primary.fg',
        boxShadow: 'lg',
        _hover: {
          bg: 'primary.bg',
          transform: 'scale(1.02)',
        },
      },
      false: {
        bg: 'bgSolid.text',
        _hover: {
          bg: 'primary.bg',
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: 'menucard',
      isSelected: true,
      css: {
        bg: 'primary.bg',
      },
    },
  ],
  defaultVariants: {
    variant: 'menucard',
    isSelected: false,
  },
})
