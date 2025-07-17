import { defineRecipe } from '@pandacss/dev'

export const cartSlideout = defineRecipe({
  className: 'cartSlideout',
  description: 'Sliding cart panel with overlay support',
  base: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    bg: 'surface.container',
    boxShadow: '2xl',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 50,
    p: 'padding.block.lg',
  },
  variants: {
    isOpen: {
      true: {
        transform: 'translateX(0)',
      },
      false: {
        transform: 'translateX(100%)',
      }
    },
    size: {
      mobile: {
        width: '100%',
        maxWidth: '100%',
        borderRadius: 0,
      },
      desktop: {
        width: '400px',
        maxWidth: '100%',
        borderRadius: 'lg 0 0 lg',
      }
    }
  },
  defaultVariants: {
    isOpen: false,
    size: 'desktop'
  }
})

export const cartOverlay = defineRecipe({
  className: 'cartOverlay',
  description: 'Backdrop overlay for cart',
  base: {
    position: 'fixed',
    inset: 0,
    bg: 'fill',
    zIndex: 40,
    transition: 'opacity 0.3s ease-in-out',
  },
  variants: {
    isVisible: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
      },
      false: {
        opacity: 0,
        pointerEvents: 'none',
      }
    }
  },
  defaultVariants: {
    isVisible: false
  }
})

export const cartContent = defineRecipe({
  className: 'cartContent',
  description: 'Cart content area styling',
  base: {
    flex: '1',
    overflowY: 'auto',
    pb: 'padding.block.lg',
  },
  variants: {
    isEmpty: {
      true: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      false: {
        display: 'block',
      }
    }
  },
  defaultVariants: {
    isEmpty: false
  }
})

export const cartControls = defineRecipe({
  className: 'cartControls',
  description: 'Cart summary and checkout controls',
  base: {
    mt: 'padding.block.sm',
  },
  variants: {
    hasItems: {
      true: {
        display: 'block',
      },
      false: {
        display: 'none',
      }
    }
  },
  defaultVariants: {
    hasItems: true
  }
})

// Alternative approach using cva (class-variance-authority) style
export const cartVariants = {
  slideout: {
    base: 'fixed top-0 right-0 bottom-0 flex flex-col bg-surface-container shadow-2xl transition-transform duration-300 ease-in-out z-50 p-padding-block-lg',
    variants: {
      isOpen: {
        true: 'translate-x-0',
        false: 'translate-x-full'
      },
      size: {
        mobile: 'w-full max-w-full rounded-none',
        desktop: 'w-400px max-w-full rounded-l-lg'
      }
    }
  },
  overlay: {
    base: 'fixed inset-0 bg-fill z-40 transition-opacity duration-300 ease-in-out',
    variants: {
      isVisible: {
        true: 'opacity-100 pointer-events-auto',
        false: 'opacity-0 pointer-events-none'
      }
    }
  }
}