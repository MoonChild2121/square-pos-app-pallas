'use client'

import { memo } from 'react'
import { Box, VStack } from '@styled-system/jsx'
import { Utensils } from 'lucide-react'
import Heading from '@/components/primitives/ui/typography/heading'
import Paragraph from '@/components/primitives/ui/typography/paragraph'
import { itemCard } from '@styled-system/recipes'
import { MenuBoxProps } from '@/shared/types/menu'

const MenuBox = memo(function MenuBox({ 
  label, 
  count, 
  icon, 
  isSelected = false, 
  onClick 
}: MenuBoxProps) {
  return (
    <Box
      onClick={onClick}
      className={itemCard({ variant: 'menu', isSelected })}
    >
      <VStack align="flex-start" justify="space-between" h="100%" >
        <Box p="padding.block.sm">
          {icon ?? <Utensils size={20} />}
        </Box>
        <VStack justify="space-between" w="100%">
          <Heading level={4}>{label}</Heading>
          <Paragraph size="base">{count} Items</Paragraph>
        </VStack>
      </VStack>
    </Box>
  )
})

export default MenuBox
