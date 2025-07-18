import { Input } from '@/components/primitives/ui/input'
import { Stack } from '@styled-system/jsx'
import { AtSign, Search } from 'lucide-react'
 
export default function Example() {
  return (
    <Stack w="full" maxW="sm" align="flex-start" gap="4">
      <Input size="md">
        <Input.Prefix>
          <AtSign size={16} />
        </Input.Prefix>
        <Input.Text placeholder="Email" />
      </Input>
 
      <Input size="md">
        <Input.Text placeholder="Search" />
        <Input.Postfix>
          <Search size={16} />
        </Input.Postfix>
      </Input>
 
      <Input size="md">
        <Input.Prefix>
          <span>https://</span>
        </Input.Prefix>
        <Input.Text placeholder="Website" />
        <Input.Postfix>
          <span>.com</span>
        </Input.Postfix>
      </Input>
    </Stack>
  )
}