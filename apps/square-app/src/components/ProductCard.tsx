'use client'

import { Box, VStack, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/ui/typography/heading'
import Paragraph from '@/components/ui/typography/paragraph'

interface ProductCardProps {
  name: string
  price: number
  imageUrl?: string
  onClick?: () => void
}

export default function ProductCard({ name, price, imageUrl, onClick }: ProductCardProps) {
  return (
    <Box
      className={css({
        bg: 'white',
        borderRadius: 'xl',
        p: '3',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        _hover: {
          transform: 'scale(1.02)',
        },
      })}
      onClick={onClick}
    >
      <Box
        className={css({
          bg: 'gray.50',
          borderRadius: 'xl',
          p: '2',
          mb: '2',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <img
          src={imageUrl || '/placeholder-image.jpg'}
          alt={name}
          className={css({
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          })}
        />
      </Box>
      <Box>
        <Box
          className={css({
            fontSize: 'sm',
            fontWeight: 'medium',
            mb: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}
        >
          {name}
        </Box>
        <Box
          className={css({
            fontSize: 'sm',
            color: 'gray.600',
          })}
        >
          ${price.toFixed(2)}
        </Box>
      </Box>
    </Box>
  )
}
