'use client';

import { useState } from 'react';
import { Box } from '@styled-system/jsx';
import { cartOverlay, cartSlideout } from '@styled-system/recipes';
import { CartToggle } from '@/components/composites/buttons/CartToggle';
import { CartContainer } from '@/containers/CartContainer';

export function CartUI() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      {/* Overlay - using recipe */}
      <Box
        className={cartOverlay({ isVisible: isCartOpen })}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Toggle */}
      <CartToggle isOpen={isCartOpen} onToggle={() => setIsCartOpen(!isCartOpen)} />

      {/* Cart Container - using recipe */}
      <Box
        className={cartSlideout({
          isOpen: isCartOpen,
          size: { base: 'mobile', md: 'desktop' },
        })}
      >
        <CartContainer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </Box>
    </>
  );
}
