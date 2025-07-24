// productCard.ts
import { defineRecipe } from '@pandacss/dev'

export const itemCard = defineRecipe({
  className: 'productCard',
  description: 'Product card styling for menu and default cards',
  base: {
    borderRadius: 'xl',
    boxShadow: 'sm',
    bg: 'surface.layout',
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    _hover: {
      transform: 'scale(1.02)',
    },
    p: 'padding.inline.sm',
  },
  variants: {
    variant: {
      menu: {
        bg: 'bgSolid.text',
        w: '150px',
        h: '150px',
        minW: '120px',
        cursor: 'pointer',
        p: 'padding.block.lg',
        justifyContent: 'space-between',
        display: 'flex',
        flexDir: 'column',
        _hover: {
          bg: 'primary.bg',
        },
      },
    },
    isSelected: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variant: 'menu',
      isSelected: true,
      css: {
        bg: 'primary.bg',
        color: 'text',
        _hover: {
          bg: 'primary.bg',
        },
      },
    },
  ],
  defaultVariants: {
    variant: undefined,
    isSelected: false,
  },
})

export const orderCard = defineRecipe({
  className: 'orderItemCard',
  description: 'Card styling for order summary items',
  base: {
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'border',
    bg: 'surface.container',
    p: 'padding.inline.sm',
    gap: 'gap.inline.md',
  },
})
