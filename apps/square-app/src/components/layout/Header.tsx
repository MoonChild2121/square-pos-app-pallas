'use client'

import { Box, HStack } from '@styled-system/jsx'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import { header } from '@styled-system/recipes'
import { pill } from '@styled-system/recipes'
import { LogOut } from 'lucide-react'
import Heading from '@/components/ui/typography/heading'

export function Header() {
  const { data: session } = useSession()
  const merchantName = session?.user?.name || 'Merchant'
  const { root, container} = header()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <Box className={root}>
      <HStack className={container}>
          <Box className={pill({ variant: 'layout' })} > 
            <Heading level={5}>{merchantName}</Heading>
            </Box>
        <Button variant="primary" shape="circle" size="icon" onClick={handleSignOut} >
            <LogOut />          
        </Button>
      </HStack>
    </Box>
  )
}
