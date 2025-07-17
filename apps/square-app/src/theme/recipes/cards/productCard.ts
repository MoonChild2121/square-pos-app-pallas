import { defineSlotRecipe, defineRecipe } from '@pandacss/dev'

// Shared base styles for all card-like components
const baseCardStyles = {
  borderRadius: 'xl',
  boxShadow: 'sm',
  transition: 'all 0.2s ease-in-out',
  bg: 'bgSolid.text',
}

const hoverScaleStyles = {
  cursor: 'pointer',
  _hover: {
    transform: 'scale(1.02)',
  },
}

const containerPadding = {
  p: 'padding.block.sm',
}

const flexCenterStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const flexSpaceBetween = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

// Product card with all common styles applied
export const productCard = defineSlotRecipe({
  className: 'productCard',
  description: 'Product card with image, name, price, modifiers, and controls slots',
  slots: ['root', 'image', 'nameContainer', 'name', 'price', 'modifierContainer', 'controlsContainer', 'quantityControls', 'quantityDisplay'],
  base: {
    root: {
      ...baseCardStyles,
      ...hoverScaleStyles,
      pt: 'padding.block.sm',
    },
    image: {
      borderRadius: 'xl',
      ...containerPadding,
      aspectRatio: '4/3',
      ...flexCenterStyles,
      
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }
    },
    nameContainer: {
      borderRadius: '0 0 10px 10px',
      ...containerPadding,
      bg: 'fill.secondary',
    },
    name: {
      mb: 'padding.block.sm',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    price: {
      borderBottom: '1px solid',
      borderColor: 'border',
    },
    modifierContainer: {
      ...containerPadding,
    },
    controlsContainer: {
      ...containerPadding,
    },
    quantityControls: {
      ...flexSpaceBetween,
    },
    quantityDisplay: {
      ...flexCenterStyles,
    },
  },
  variants: {
    hasModifiers: {
      true: {
        modifierContainer: {
          display: 'block',
        }
      },
      false: {
        modifierContainer: {
          display: 'none',
        }
      }
    }
  },
  defaultVariants: {
    hasModifiers: false
  }
})

// Menu card with shared styles
export const menuCard = defineRecipe({
  className: 'menuCard',
  description: 'Menu selection card with optional selection highlight',
  base: {
    ...baseCardStyles,
    ...hoverScaleStyles,
    p: 'padding.block.lg',
    minW: '120px',
    w: '150px',
    h: '150px',
  },
  variants: {
    isSelected: {
      true: {
        bg: 'primary.bg',
        color: 'primary.fg',
        boxShadow: 'lg',
        _hover: {
          bg: 'primary.bg',
          transform: 'scale(1.02)', // Preserve the scale on hover
        },
      },
      false: {
        _hover: {
          bg: 'primary.bg',
          transform: 'scale(1.02)', // Preserve the scale on hover
        },
      },
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      css: {
        bg: 'primary.bg',
        transform: 'scale(1.02)',
      },
    },
  ],
  defaultVariants: {
    isSelected: false,
  },
})

// Order item card with shared styles
// Updated orderItemCard using defineSlotRecipe
export const orderItemCard = defineSlotRecipe({
  className: 'orderItemCard',
  description: 'Card component for order items with image, content, and total slots',
  slots: ['root', 'image', 'content', 'total'],
  base: {
    root: {
      borderRadius: 'lg',
      boxShadow: 'sm',
      p: '3',
      bg: 'surface.container.low',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '4',
    },
    image: {
      position: 'relative',
      w: '64px',
      h: '64px',
      flexShrink: 0,
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'md',
      },
    },
    content: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
    },
    total: {
      minW: 'fit-content',
    },
  },
})

// Optional: Create a unified card recipe that can handle all cases
export const unifiedCard = defineRecipe({
  className: 'unifiedCard',
  description: 'Unified card component that can handle all card types',
  base: {
    ...baseCardStyles,
    position: 'relative',
  },
  variants: {
    type: {
      product: {
        ...hoverScaleStyles,
        pt: 'padding.block.sm',
      },
      menu: {
        ...hoverScaleStyles,
        p: 'padding.block.lg',
        minW: '120px',
        w: '150px',
        h: '150px',
      },
      orderItem: {
        p: '3',
        bg: 'surface.container.low',
        borderRadius: 'lg',
        ...flexSpaceBetween,
        gap: '4',
      },
    },
    isSelected: {
      true: {
        bg: 'primary.bg',
        color: 'primary.fg',
        boxShadow: 'lg',
      },
      false: {},
    },
    hasHover: {
      true: {
        cursor: 'pointer',
        _hover: {
          transform: 'scale(1.02)',
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      type: 'menu',
      isSelected: true,
      css: {
        _hover: {
          bg: 'primary.bg',
          transform: 'scale(1.02)',
        },
      },
    },
    {
      type: 'menu',
      isSelected: false,
      css: {
        _hover: {
          bg: 'primary.bg',
          transform: 'scale(1.02)',
        },
      },
    },
  ],
  defaultVariants: {
    type: 'product',
    isSelected: false,
    hasHover: true,
  },
})