import { defineRecipe } from '@pandacss/dev'

export const searchBox = defineRecipe({
  className: 'searchBox',
  description: 'Search box styled to align visually with menu cards',
  base: {
    w: 'full',
    p: '4',
    borderRadius: 'xl',
    bg: 'bgSolid.text',
    border: '1px solid',
    borderColor: 'primary.border',
    transition: 'all 0.2s',
  },
  variants: {
    // Optional future variants
  },
})
