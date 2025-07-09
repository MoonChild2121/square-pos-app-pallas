import { Box, HStack, VStack } from '@styled-system/jsx'
import Paragraph from '@/components/ui/typography/paragraph'
import Heading from '@/components/ui/typography/heading'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { cartItem } from '@styled-system/recipes'

interface Props {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  taxIds?: string[]
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  taxIds,
}: Props) {
  const { updateQuantity } = useCart()

  const { root, image, content, title, controls, button } = cartItem()

  return (
    <Box pb="3">
      <HStack className={root}>
        <Box className={image}>
          <img
            src={imageUrl || '/placeholder-image.jpg'}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>
        <VStack className={content}>
          <Heading level={5} className={title}>{name}</Heading>
          <Paragraph size="sm">${price.toFixed(2)}</Paragraph>
          {taxIds && taxIds.length > 0 && (
            <Paragraph size="sm" color="secondary">Tax ID: {taxIds[0]}</Paragraph>
          )}
        </VStack>
        <HStack className={controls}>
          <Box onClick={() => updateQuantity(id, quantity - 1)} className={button}>
            <Minus size={14} />
          </Box>
          <Paragraph>{quantity}</Paragraph>
          <Box onClick={() => updateQuantity(id, quantity + 1)} className={button}>
            <Plus size={14} />
          </Box>
        </HStack>
      </HStack>
    </Box>
  )
}
