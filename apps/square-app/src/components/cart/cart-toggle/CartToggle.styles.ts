export const toggleButton = {
  position: 'fixed',
  bottom: '6',
  right: '6',
  borderRadius: 'full',
  display: 'flex',
  alignItems: 'center',
  gap: 'gap.inline.sm',
  zIndex: '50',
  boxShadow: 'xl',
  transition: 'transform 0.2s ease-in-out',
  p: '6',
}

export const hiddenStyle = {
  transform: 'scale(0)',
}

export const visibleStyle = {
  transform: 'scale(1)',
  _hover: {
    transform: 'scale(1.05)',
  },
}

export const quantityBadge = {
  bg: 'primary.fg',
  color: 'primary.bg',
  borderRadius: 'full',
  px: 'padding.inline.sm',
  py: 'padding.block.sm',
  fontWeight: 'bold',
  minWidth: '6',
  textAlign: 'center',
}
