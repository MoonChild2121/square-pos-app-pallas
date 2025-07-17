'use client'
 
import Select from '@/components/ui/select'
import { ModifierData } from '@/types/modifiers'
import { css } from '@styled-system/css'

interface SelectModifierProps {
  modifiers: ModifierData[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectModifier({ modifiers, value, onChange }: SelectModifierProps) {
  // Find the selected modifier for display
  const selectedModifier = modifiers.find(mod => mod.id === value)

  const truncateStyle = css({
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block'
  })

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger style={{ width: '100%' }}>
        <Select.Value placeholder="Select modifier">
          {selectedModifier ? (
            <span className={truncateStyle}>
              {selectedModifier.name} 
            </span>
          ) : (
            'Select modifier'
          )}
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Options</Select.Label>
          {modifiers.map((modifier) => (
            <Select.Item 
              key={modifier.id} 
              value={modifier.id}
              className={css({
                display: 'block',
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              })}
            >
              {modifier.name} (+${(modifier.priceMoney.amount / 100).toFixed(2)})
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}