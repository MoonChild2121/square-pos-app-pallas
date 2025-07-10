// @styled-system/recipes/pill.ts
import { defineRecipe } from '@pandacss/dev'

export const pill = defineRecipe({
  className: 'pill',
  description: 'Reusable pill-style UI element with variants for layout, primary, and tag',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3xl',
    fontWeight: 'medium',
    fontSize: { base: 'sm', md: 'md' },
    whiteSpace: 'nowrap',
    px: { base: '4', md: '6' },
    py: { base: '1', md: '2' },
  },
  variants: {
    variant: {
      layout: {
        fontSize: { base: 'sm', lg: 'lg' },
        bg: 'surface.layout',
        color: 'text.primary',
      },
      primary: {
        fontSize: { base: 'sm', lg: 'lg' },
        bg: 'primary',
        color: 'bgColor.primary',
      },
      tag: {
        px: { base: '2', md: '3' },
        py: { base: '0.5', md: '1' },
        fontSize: { base: 'xs', md: 'sm' },
        borderRadius: 'full',
        fontWeight: 'semibold',
        bg: 'green.100',
        color: 'green.800',
      },
    },
  },
  defaultVariants: {
    variant: 'layout',
  },
})
