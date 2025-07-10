'use client'

import { memo, useCallback } from 'react'
import { Box, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/ui/typography/heading'
import MenuBox from './MenuBox'

interface MenuItem {
  id: string
  label: string
  count: number
  icon?: React.ReactNode
}

interface MenuBoxGridProps {
  items: MenuItem[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

// Memoized individual menu item component
const MenuItem = memo(function MenuItem({
  item,
  isSelected,
  onSelect
}: {
  item: MenuItem
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const handleClick = useCallback(() => {
    onSelect(item.id)
  }, [item.id, onSelect])

  return (
    <MenuBox
      key={item.id}
      label={item.label}
      count={item.count}
      icon={item.icon}
      isSelected={isSelected}
      onClick={handleClick}
    />
  )
})

const MenuBoxGrid = memo(function MenuBoxGrid({ 
  items, 
  selectedCategory, 
  onCategorySelect 
}: MenuBoxGridProps) {
  return (
    <Box>
      {/* Scrollable horizontal list */}
      <Box
        className={css({
          p: '4',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        })}
      >
        <HStack gap="4" w="max-content">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isSelected={selectedCategory === item.id}
              onSelect={onCategorySelect}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  )
})

export default MenuBoxGrid
