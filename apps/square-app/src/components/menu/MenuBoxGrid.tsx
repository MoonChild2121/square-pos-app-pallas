'use client'

import { Box, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/ui/typography/heading'
import MenuBox from '@/components/menu/MenuBox'
import { Utensils } from 'lucide-react'
import MenuWithRecipe from './MenuWithRecipe'

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

export default function MenuBoxGrid({ items, selectedCategory, onCategorySelect }: MenuBoxGridProps) {
  return (
    <Box>
      {/* Header section */}
      <Box
        className={css({
          mb: '3',
          px: '4',
        })}
      >
        <Heading level={3}>m</Heading>
      </Box>

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
            <MenuWithRecipe
              key={item.id}
              label={item.label}
              count={item.count}
              icon={item.icon}
              isSelected={selectedCategory === item.id}
              onClick={() => onCategorySelect(item.id)}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  )
}
