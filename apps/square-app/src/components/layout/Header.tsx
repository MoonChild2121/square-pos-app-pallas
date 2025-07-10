'use client'

import { Box, HStack } from '@styled-system/jsx'
import Avatar from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import { header } from '@styled-system/recipes'
import { pill } from '@styled-system/recipes'

export function Header() {
  const { data: session } = useSession()
  const merchantName = session?.user?.name || 'Merchant'
  const avatarUrl = (session?.user as any)?.image || ''
  const { root, container, user, name, button } = header()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <Box className={root}>
      <HStack className={container}>
        <HStack className={user}>
          <Avatar.Root className={header().avatar}>
            <Avatar.Image src={avatarUrl} />
            <Avatar.Fallback>{merchantName?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
          </Avatar.Root>
          <Box className={pill({ variant: 'layout' })}> 
            {merchantName}
            </Box>
        </HStack>
        <Button className={pill({ variant: 'primary' })} onClick={handleSignOut} >
          Sign Out
        </Button>
      </HStack>
    </Box>
  )
}
