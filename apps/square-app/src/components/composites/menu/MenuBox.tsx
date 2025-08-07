'use client';

import { memo, useState, useEffect } from 'react';
import { Box, VStack } from '@styled-system/jsx';
import { Utensils } from 'lucide-react';
import Heading from '@/components/primitives/ui/typography/heading';
import Paragraph from '@/components/primitives/ui/typography/paragraph';
import { itemCard } from '@styled-system/recipes';
import { MenuBoxProps } from '@/shared/types/menu';

const MenuBox = memo(function MenuBox({
  label,
  count,
  icon,
  isSelected = false,
  onClick,
}: MenuBoxProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isMounted) {
    return (
      <Box onClick={onClick} className={itemCard({ variant: 'menu', isSelected: false })}>
        <VStack align="flex-start" justify="space-between" h="100%">
          <Box p="padding.block.sm">{icon ?? <Utensils size={20} />}</Box>
          <VStack justify="space-between" w="100%">
            <Heading level={4}>{label}</Heading>
            <Paragraph size="base">0 Items</Paragraph>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box onClick={onClick} className={itemCard({ variant: 'menu', isSelected })}>
      <VStack align="flex-start" justify="space-between" h="100%">
        <Box p="padding.block.sm">{icon ?? <Utensils size={20} />}</Box>
        <VStack justify="space-between" w="100%">
          <Heading level={4}>{label}</Heading>
          <Paragraph size="base">{count} Items</Paragraph>
        </VStack>
      </VStack>
    </Box>
  );
});

export default MenuBox;
