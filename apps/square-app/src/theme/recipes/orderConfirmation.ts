import { defineSlotRecipe } from '@pandacss/dev'

export const orderConfirmation = defineSlotRecipe({
  className: 'orderConfirmation',
  description: 'Order confirmation page layout with header, items list, and summary',
  slots: ['root', 'header', 'content', 'itemsSection', 'summarySection', 'successMessage'],
  base: {
    root: {
      minH: '100vh',
      bg: 'surface.container.lowest',
      p: { base: '4', md: '6', lg: '8' },
    },
    header: {
      textAlign: 'center',
      mb: { base: '6', md: '8' },
    },
    content: {
      maxW: '1200px',
      mx: 'auto',
      display: 'grid',
      gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' },
      gap: { base: '6', lg: '8' },
      alignItems: 'start',
    },
    itemsSection: {
      bg: 'surface.container',
      borderRadius: 'xl',
      p: { base: '4', md: '6' },
      boxShadow: 'md',
    },
    summarySection: {
      bg: 'surface.container',
      borderRadius: 'xl',
      p: { base: '4', md: '6' },
      boxShadow: 'md',
      position: { lg: 'sticky' },
      top: { lg: '6' },
      maxH: { lg: 'calc(100vh - 12rem)' },
      overflowY: { lg: 'auto' },
    },
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3',
      p: '4',
      bg: 'success.50',
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'success.200',
      mb: '6',
    },
  },
}) 