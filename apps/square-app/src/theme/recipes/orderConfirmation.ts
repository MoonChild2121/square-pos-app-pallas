import { defineSlotRecipe } from '@pandacss/dev'

export const orderConfirmation = defineSlotRecipe({
  className: 'containerLayout',
  description: 'Slot-based layout structure for page containers, cards, alerts, and content areas',
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
      p: { base: 'padding.block.md', md: 'padding.block.lg', lg: 'padding.block.xl' },
    },
    cardContainer: {
      bg: 'surface.container',
      borderRadius: 'xl',
      p: { base: 'padding.block.md', md: 'padding.block.lg' },
      boxShadow: 'md',
    },
    contentGrid: {
      maxW: '1200px',
      mx: 'auto',
      display: 'grid',
      gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' },
      gap: { base: 'gap.inline.md', lg: 'gap.inline.lg' },
      alignItems: 'start',
    },
    successAlert: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'gap.inline.sm',
      p: 'padding.block.md',
      color: 'success.text',
      bg: 'success.bg',
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'success.border',
      mb: 'padding.block.lg',
    },
    itemsSection: {
      bg: 'surface.container',
      borderRadius: 'xl',
      p: { base: 'padding.block.md', md: 'padding.block.lg' },
      boxShadow: 'md',
      maxH: 'calc(100vh - 300px)',
      overflowY: 'auto',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      minH: '300px',
    },
  },
})
