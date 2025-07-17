// @styled-system/recipes/header.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const header = defineSlotRecipe({
  className: 'header',
  description: 'App header with user info and sign out button',
  slots: ['root', 'container', 'user'],
  base: {
    root: {
      px: { base: 'padding.block.sm', md: 'padding.block.lg' },
      py: { base: 'padding.inline.sm', md: 'padding.inline.lg' },
      borderRadius: 'lg',
      bg: 'surface.container',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      w: '100%',
      flexDirection: { base: 'column', sm: 'row' }, 
      gap: { base: 'gap.inline.lg', sm: '0' }, 
    },
  },
})
