import { defineRecipe } from '@pandacss/dev';

export const pill = defineRecipe({
  className: 'pill',
  description: 'Reusable pill-style UI element with flexible styling options',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    p: 'padding.block.md',
  },
  variants: {
    variant: {
      layout: {
        borderRadius: 'full',
        bg: 'surface.layout',
        color: 'text.primary',
        justifyContent: 'center',
        px: 'padding.inline.lg',
      },
      cart: {
        color: 'secondary',
        border: '1px solid',
        borderRadius: 'xl',
        borderColor: 'surface.spotlight', // default border
        w: '100%',
        bg: 'success.bg',
        justifyContent: 'space-between',
      },
    },
    colorScheme: {
      default: {
        borderColor: 'surface.spotlight',
      },
      success: {
        borderColor: 'success',
      },
      danger: {
        borderColor: 'danger',
      },
      warning: {
        borderColor: 'warning',
      },
      info: {
        borderColor: 'info',
      },
    },
  },
  // Only apply colorScheme border styles when variant is 'cart'
  compoundVariants: [
    {
      variant: 'cart',
      colorScheme: 'default',
      css: {
        borderColor: 'surface.spotlight',
      },
    },
    {
      variant: 'cart',
      colorScheme: 'success',
      css: {
        borderColor: 'success',
      },
    },
    {
      variant: 'cart',
      colorScheme: 'danger',
      css: {
        borderColor: 'danger',
      },
    },
    {
      variant: 'cart',
      colorScheme: 'warning',
      css: {
        borderColor: 'warning',
      },
    },
    {
      variant: 'cart',
      colorScheme: 'info',
      css: {
        borderColor: 'info',
      },
    },
  ],
  defaultVariants: {
    variant: 'layout',
    colorScheme: 'default',
  },
});
