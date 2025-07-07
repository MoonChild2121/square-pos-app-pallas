'use client'

import { useCallback, useState } from 'react'
import { HStack, Box } from '@styled-system/jsx'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import debounce from 'lodash/debounce'
import { searchBox } from '@styled-system/recipes' 

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term)
    }, 300),
    [onSearch]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  return (
    <HStack align="flex-start" gap="1.5" pl="4"> 
      <Input className={searchBox()} size="lg" shape="rounded">
        <Input.Text 
          placeholder="Search" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Input.Postfix>
          <Search size={20} />
        </Input.Postfix>
      </Input>
    </HStack>
  )
}
