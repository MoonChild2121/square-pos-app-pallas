'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { Utensils } from 'lucide-react'
import Heading from '@/components/ui/typography/heading'
import Paragraph from '@/components/ui/typography/paragraph'

interface MenuBoxProps {
  label: string
  count: number
  icon?: React.ReactNode
}

export default function MenuBox({ label, count, icon }: MenuBoxProps) {
  return (
    <Box
      p="4"
      minW="120px"
      className={css({
        border: '1px solid',
        borderColor: 'primary.border',
        borderRadius: 'xl',
        width: '150px',
        height: '150px',
        bg: 'bgSolid.text',
        transition: 'all 0.2s',
        _hover: {
          bg: 'primary.bgHover',
          borderColor: 'primary.borderHover',
          cursor: 'pointer',
        },
      })}
    >
      <VStack align="flex-start" justify="space-between" h="100%">
        {/* Icon in blue circle */}
        <Box
          p="2"
          className={css({
            borderRadius: 'full',
            bg: 'primary',
            color: 'bgSolid.text',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {icon ?? <Utensils size={20} />}
        </Box>

        {/* Label and count */}
        <VStack justify="space-between" w="100%">
          <Heading level={4}>
            {label}
          </Heading>
          <Paragraph size="base">
            {count} Items
          </Paragraph>
        </VStack>
      </VStack>
    </Box>
  )
}
