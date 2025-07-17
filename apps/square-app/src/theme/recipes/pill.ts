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
    p: 'padding.block.md',
    bg: 'surface.container.low',
  },
  variants: {
    variant: {
      layout: {
        bg: 'surface.layout',
        color: 'text.primary',
        justifyContent: 'center',
        px: 'padding.inline.lg',
      },
      discount: {
        bg: 'surface.container.low',
        border: '1px solid',
        borderColor: 'success',
        color: 'success',
        w: '100%',
        justifyContent: 'space-between',
      },
      tax: {
        bg: 'surface.container.low',
        border: '1px solid',
        borderColor: 'surface.container.highest',
        color: 'secondary',
        w: '100%',
        justifyContent: 'space-between',
      }
    },
  },
  defaultVariants: {
    variant: 'layout',
  },
})
