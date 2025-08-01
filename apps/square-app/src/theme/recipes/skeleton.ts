import { defineRecipe } from '@pandacss/dev';

export const skeleton = defineRecipe({
  className: 'skeleton',
  description: 'Styles for the Skeleton component',
  base: {
    animationStyle: 'skeleton',
    bg: 'bgSolid.text',
    display: 'flex',
    flexDir: 'column',
  },
  variants: {
    variant: {
      orderDetails: {
        p: 'padding.block.md',
        rounded: 'xl',
        boxShadow: 'md',
        bg: 'surface.layout',
        w: 'full',
        minW: '100%',
        maxW: '100%',
        alignSelf: 'flex-start',
      },
      orderSummary: {
        p: 'padding.block.md',
        boxShadow: 'md',
        w: 'full',
        maxW: '100%',
        maxH: '100%',
        overflowX: 'hidden',
      },
      orderItem: {
        p: 'padding.inline.lg',
        display: 'flex',
        alignItems: 'center',
        gap: 'gap.inline.md',
        bg: 'surface.layout',
        boxShadow: 'sm',
        w: 'full',
      },
    },
  },
  defaultVariants: {
    variant: 'orderDetails',
  },
});
