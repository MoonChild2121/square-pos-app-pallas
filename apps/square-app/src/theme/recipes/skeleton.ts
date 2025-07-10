import { defineRecipe } from '@pandacss/dev'

export const skeleton = defineRecipe({
  className: 'skeleton',
  base: {
    background: 'surface.variant',
    borderRadius: 'md',
    opacity: 0.7,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  variants: {
    variant: {
      default: {
        background: 'surface.variant',
      },
      primary: {
        background: 'surface.container.highest',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}) 