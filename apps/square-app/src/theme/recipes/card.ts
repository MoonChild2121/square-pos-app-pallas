import { defineRecipe } from '@pandacss/dev'

export const cardBox = defineRecipe({
  className: 'cardBox',
  description: 'Card component with productcard and menucard variants',
  base: {
    borderRadius: 'xl',
    transition: 'all 0.2s ease-in-out',
  },
  variants: {
    variant: {
      productcard: {
        bg: 'primary.bg',
        p: '2',
        cursor: 'pointer',
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'primary.border',
        _hover: {
          transform: 'scale(1.02)',
        },
      },
      menucard: {
        p: '4',
        minW: '120px',
        w: '150px',
        h: '150px',
        bg: 'primary.bg',
        border: '1px solid',
        borderColor: 'primary.border',
        borderRadius: 'xl',
        transition: 'all 0.2s',
        _hover: {
          bg: 'primary.bgHover',
          borderColor: 'primary.borderHover',
          cursor: 'pointer',
        },
      },
       cartitem: {
        p: '2',
        bg: 'surface.layout',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
      },
    },
    isSelected: {
      true: {
        bg: 'primary.bgHover',
        borderColor: 'primary.hover',
      },
      false: {
        bg: 'primary.bg',
        borderColor: 'primary.border',
      },
    },
  },
  defaultVariants: {
    variant: 'productcard',
  },
})

