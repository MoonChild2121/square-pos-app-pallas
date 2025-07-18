import { defineSlotRecipe } from '@pandacss/dev'

export const orderConfirmation = defineSlotRecipe({
  className: 'containerLayout',
  description: 'Responsive slot-based layout structure for page containers, cards, alerts, and content areas',
  slots: [
    'pageContainer',
    'cardContainer',
    'contentGrid',
    'successAlert',
    'itemsSection',
    'emptyState',
  ],
  base: {
    pageContainer: {
      minH: '100vh',
      bg: 'surface.container.lowest',
      p: { 
        base: 'padding.block.sm', 
        sm: 'padding.block.md', 
        md: 'padding.block.lg', 
        lg: 'padding.block.xl' 
      },
      // Add responsive width constraints
      w: 'full',
      maxW: '100vw',
      overflowX: 'hidden',
    },
    cardContainer: {
      bg: 'surface.container',
      borderRadius: { base: 'lg', md: 'xl' },
      p: { 
        base: 'padding.block.sm', 
        sm: 'padding.block.md', 
        md: 'padding.block.lg' 
      },
      boxShadow: { base: 'sm', md: 'md' },
      w: 'full',
      maxW: '100%',
    },
    contentGrid: {
      maxW: '1200px',
      mx: 'auto',
      display: 'grid',
      gridTemplateColumns: { 
        base: '1fr', 
        md: '1fr', 
        lg: '2fr 1fr' 
      },
      gap: { 
        base: 'gap.inline.sm', 
        sm: 'gap.inline.md', 
        lg: 'gap.inline.lg' 
      },
      alignItems: 'start',
      w: 'full',
      // Stack on mobile, side-by-side on desktop
      gridTemplateAreas: {
        base: '"items" "summary"',
        lg: '"items summary"'
      }
    },
    successAlert: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: { base: 'column', sm: 'row' },
      gap: { base: 'gap.inline.xs', sm: 'gap.inline.sm' },
      p: { 
        base: 'padding.block.sm', 
        sm: 'padding.block.md' 
      },
      color: 'success.text',
      bg: 'success.bg',
      borderRadius: { base: 'md', sm: 'lg' },
      border: '1px solid',
      borderColor: 'success.border',
      mb: { 
        base: 'padding.block.md', 
        sm: 'padding.block.lg' 
      },
      textAlign: { base: 'center', sm: 'left' },
      w: 'full',
      maxW: '100%',
    },
    itemsSection: {
      bg: 'surface.container',
      borderRadius: { base: 'lg', md: 'xl' },
      p: { 
        base: 'padding.block.sm', 
        sm: 'padding.block.md', 
        md: 'padding.block.lg' 
      },
      boxShadow: { base: 'sm', md: 'md' },
      maxH: { 
        base: 'calc(50vh - 100px)', 
        sm: 'calc(60vh - 200px)', 
        lg: 'calc(100vh - 300px)' 
      },
      overflowY: 'auto',
      w: 'full',
      gridArea: 'items',
      // Add touch scrolling for mobile
      WebkitOverflowScrolling: 'touch',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      minH: { base: '200px', sm: '300px' },
      textAlign: 'center',
      p: { base: 'padding.block.md', sm: 'padding.block.lg' },
    },
  },
  variants: {
    // Add responsive variants if needed
    size: {
      compact: {
        pageContainer: {
          p: { base: 'padding.block.xs', sm: 'padding.block.sm' },
        },
        cardContainer: {
          p: { base: 'padding.block.xs', sm: 'padding.block.sm' },
        },
        itemsSection: {
          p: { base: 'padding.block.xs', sm: 'padding.block.sm' },
        },
      },
    },
  },
})