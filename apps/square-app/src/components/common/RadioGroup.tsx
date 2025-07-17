'use client'

import { Label } from '@/components/ui/label'
import RadioGroup from '@/components/ui/radio-group'
import { Box, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'

interface Option {
  id: string;
  label: string;
  price?: number;
}

interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  groupId: string; // used for name/htmlFor scoping
}

export default function ModifierRadioGroup({
  options,
  value,
  onChange,
  groupId,
}: RadioGroupProps) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      name={`modifier-group-${groupId}`} // ensures radio isolation
    >
      {options.map((option) => {
        const inputId = `${groupId}-${option.id}`; // ensures unique id
        return (
          <HStack key={option.id} gap="2">
            <RadioGroup.Item value={option.id} id={inputId} />
            <Box>
              <Label htmlFor={inputId}>
                {option.label}
                {option.price ? ` (+$${option.price.toFixed(2)})` : ''}
              </Label>
            </Box>
          </HStack>
        );
      })}
    </RadioGroup.Root>
  );
}
