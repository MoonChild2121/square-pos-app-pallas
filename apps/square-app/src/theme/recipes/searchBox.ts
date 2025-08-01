import { defineRecipe } from '@pandacss/dev';

export const searchBox = defineRecipe({
  className: 'searchBox',
  description: 'Search box styled to align visually with menu cards',
  base: {
    w: 'full',
    p: 'padding.block.sm',
    borderRadius: 'xl',
    bg: 'bgSolid.text',
    border: '1px solid',
    borderColor: 'border.secondary',
    transition: 'all 0.2s',
  },
});
