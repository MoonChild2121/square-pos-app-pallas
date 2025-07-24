import { Button } from '@/components/primitives/ui/button'
import { ShoppingCart } from 'lucide-react'
import { css } from '@styled-system/css'
import { useCartStore } from '@/shared/stores/useCartStore'
import { CartToggleProps } from '@/shared/types/cart'
import { Paragraph } from '@/components/primitives/ui/typography'

export function CartToggle({ isOpen, onToggle }: CartToggleProps) {
  const items = useCartStore(state => state.items)
  // Calculate total quantity of all items
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)

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
        zIndex: '50',
        boxShadow: 'sm',
        transform: isOpen ? 'scale(0)' : 'scale(1)',
        transition: 'transform 0.2s ease-in-out',
        p: 'gap.inline.lg',
        _hover: {
          transform: isOpen ? 'scale(0)' : 'scale(1.05)',
        }
      })}
    >
      <ShoppingCart size={24} />
      {totalQuantity > 0 && (
        <span>
          <Paragraph size="base" textStyle="bold"  className={css({
            color: 'bgSolid.text'
        })}>{totalQuantity}</Paragraph>
        </span>
      )}
    </Button>
  )
} 