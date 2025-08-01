'use client'

import { useCallback, useEffect, useState } from 'react'
import { HStack } from '@styled-system/jsx'
import { Input } from '@/components/primitives/ui/input'
import { Search, X } from 'lucide-react'
import debounce from 'lodash/debounce'
import { searchBox } from '@styled-system/recipes'
import { Button } from '@/components/primitives/ui/button'
import { css } from '@styled-system/css'
import { DEBOUNCE_MS } from '@/shared/constants'

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term)
    }, DEBOUNCE_MS),
    [onSearch]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch]) 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <HStack align="flex-start"> 
      <Input className={searchBox()} size="lg">
      <Search size={20} className={css({ mr: 'gap.inline.sm' })}/>
        <Input.Text 
          placeholder="Search" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Input.Postfix>
          {searchTerm && (
            <Button
              type="button"
              variant="text"
              size="sm"
              onClick={handleClear}
            >
              <X size={20} />
            </Button>
          )}
        </Input.Postfix>
      </Input>
    </HStack>
  )
}
