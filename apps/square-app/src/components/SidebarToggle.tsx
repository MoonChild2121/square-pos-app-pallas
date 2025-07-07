'use client'

import { Box } from '@styled-system/jsx'
import { css, cx } from '@styled-system/css'
import { Menu } from 'lucide-react'

interface SidebarToggleProps {
  onClick: () => void
  isSidebarOpen: boolean
}

export function SidebarToggle({ onClick, isSidebarOpen }: SidebarToggleProps) {
  return (
    <Box
      onClick={onClick}
      className={cx(
        css({
          position: 'fixed',
          top: '1rem',
          width: '40px',
          height: '40px',
          borderRadius: 'full',
          bg: 'primary',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'md',
          zIndex: 100,
          _hover: {
            bg: 'primary.hover',
          },
        }),
        css({
          left: isSidebarOpen ? '260px' : '1rem', // 250px sidebar + 10px spacing
        })
      )}
    >
      <Menu size={20} />
    </Box>
  )
}
