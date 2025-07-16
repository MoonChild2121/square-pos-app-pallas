import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { css } from '@styled-system/css'
import { useCart } from '@/contexts/CartContext'

interface CartToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function CartToggle({ isOpen, onToggle }: CartToggleProps) {
  const { state } = useCart()
  const itemCount = state.items.length

  return (
    <Button
      variant="primary"
      onClick={onToggle}
      className={css({
        position: 'fixed',
        bottom: '4',
        right: '4',
        borderRadius: 'full',
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        zIndex: '50',
        boxShadow: 'lg',
        transform: isOpen ? 'scale(0)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out',
      })}
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span className={css({
          bg: 'primary.fg',
          color: 'primary.bg',
          borderRadius: 'full',
          px: '2',
          py: '0.5',
          fontSize: 'sm',
          fontWeight: 'bold',
        })}>
          {itemCount}
        </span>
      )}
    </Button>
  )
} 