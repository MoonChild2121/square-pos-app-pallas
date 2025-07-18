import { Button } from '@/components/primitives/ui/button'
import { ShoppingCart } from 'lucide-react'
import { css } from '@styled-system/css'
import { useCart } from '@/shared/contexts/CartContext'
import { CartToggleProps } from '@/shared/types/cart'

export function CartToggle({ isOpen, onToggle }: CartToggleProps) {
  const { state } = useCart()
  // Calculate total quantity of all items
  const totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button
      variant="primary"
      onClick={onToggle}
      className={css({
        position: 'fixed',
        bottom: '6',
        right: '6',
        borderRadius: 'full',
        display: 'flex',
        alignItems: 'center',
        gap: '3',
        zIndex: '50',
        boxShadow: 'xl',
        transform: isOpen ? 'scale(0)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out',
        p: '6',
        _hover: {
          transform: isOpen ? 'scale(0)' : 'scale(1.05)',
        }
      })}
    >
      <ShoppingCart size={24} />
      {totalQuantity > 0 && (
        <span className={css({
          bg: 'primary.fg',
          color: 'primary.bg',
          borderRadius: 'full',
          px: '3',
          py: '1',
          fontSize: 'md',
          fontWeight: 'bold',
          minWidth: '6',
          textAlign: 'center',
        })}>
          {totalQuantity}
        </span>
      )}
    </Button>
  )
} 