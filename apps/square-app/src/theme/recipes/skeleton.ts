import { defineRecipe } from '@pandacss/dev'

export const skeleton = defineRecipe({
  className: 'skeleton',
  description: 'Styles for the Skeleton component',
  base: {
    animationStyle: 'skeleton',
    rounded: 'md',
    bg: 'bgSolid.text',
    display: 'flex',
    flexDir: 'column',
  },
  variants: {
    variant: {
      orderDetails: {
        p: '4',
        rounded: 'xl',
        boxShadow: 'md',
        bg: 'surface.layout',
        w: 'full',
        minW: '320px',
        maxW: '360px',
        alignSelf: 'flex-start',
      },
      orderSummary: {
        p: '4',
        rounded: 'xl',
        boxShadow: 'md',
        w: 'full',
        maxW: '100%',
        overflowX: 'hidden',
      },
      orderItem: {
        p: '3',
        display: 'flex',
        alignItems: 'center',
        gap: '4',
        bg: 'surface.layout',
        rounded: 'lg',
        boxShadow: 'sm',
        w: 'full',
      },
    },
  },
  defaultVariants: {
    variant: 'orderDetails',
  },
})
