// @styled-system/recipes/header.ts
import { defineSlotRecipe } from '@pandacss/dev'

export const header = defineSlotRecipe({
  className: 'header',
  description: 'App header with user info and sign out button',
  slots: ['root', 'container', 'user', 'avatar', 'name', 'button'],
  base: {
    root: {
      px: { base: '4', md: '6' },
      py: { base: '3', md: '4' },
      borderRadius: 'lg',
      bg: 'surface.container',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      w: '100%',
      flexDirection: { base: 'column', sm: 'row' }, // Stack on mobile
      gap: { base: '3', sm: '0' }, // Add spacing when stacked
    },
    user: {
      display: 'flex',
      alignItems: 'center',
      gap: { base: '2', md: '4' },
      mb: { base: '2', sm: '0' },
    },
    avatar: {
      size: {base: 'md', md: 'lg'},
    },
  },
})
