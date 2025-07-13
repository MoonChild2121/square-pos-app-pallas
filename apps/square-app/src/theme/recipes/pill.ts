// @styled-system/recipes/pill.ts
import { defineRecipe } from '@pandacss/dev'

export const pill = defineRecipe({
  className: 'pill',
  description: 'Reusable pill-style UI element with variants for layout, primary, and tag',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    borderRadius: 'full',
  },
  variants: {
    variant: {
      layout: {
        fontSize: { base: 'sm', lg: 'lg' },
        bg: 'surface.layout',
        color: 'text.primary',
        px: { base: '4', md: '6' },
        py: { base: '1', md: '2' },
        justifyContent: 'center',
      },
      primary: {
        fontSize: { base: 'sm', lg: 'lg' },
        bg: 'primary',
        color: 'bgColor.primary',
        px: { base: '4', md: '6' },
        py: { base: '1', md: '2' },
        justifyContent: 'center',
      },
      tag: {
        px: { base: '2', md: '3' },
        py: { base: '0.5', md: '1' },
        fontSize: { base: 'xs', md: 'sm' },
        fontWeight: 'semibold',
        bg: 'green.100',
        color: 'green.800',
        justifyContent: 'center',
      },
      discount: {
        bg: 'success.50',
        border: '1px solid',
        borderColor: 'success',
        color: 'success',
        p: '2',
        w: '100%',
        gap: '2',
        mt: '1',
        justifyContent: 'space-between',
      },
      tax: {
        bg: 'surface.container.low',
        border: '1px solid',
        borderColor: 'surface.container.highest',
        color: 'secondary',
        p: '2',
        w: '100%',
        gap: '2',
        mt: '1',
        justifyContent: 'space-between',
      }
    },
  },
  defaultVariants: {
    variant: 'layout',
  },
})
