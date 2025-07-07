'use client'

import { Box, VStack, Spacer } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Avatar from '@/components/ui/avatar'
import Heading from '@/components/ui/typography/heading'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

interface SidebarProps {
  avatarUrl: string
  onClose?: () => void
}

export function Sidebar({ avatarUrl, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const merchantName = session?.user?.name || 'Merchant'

  const handleSignOut = () => {
    onClose?.() // Close sidebar if provided
    signOut({ callbackUrl: '/login' })
  }

  return (
    <VStack
      h="100vh"
      w="250px"
      px="4"
      py="6"
      justify="flex-start"
      className={css({
        bg: 'primary.bg',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        boxShadow: 'lg',
      })}
    >
      {/* Avatar + Name */}
      <VStack gap="2" align="flex-start" w="100%">
        <Avatar.Root>
          <Avatar.Image src={avatarUrl} />
          <Avatar.Fallback>{merchantName?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar.Root>
        <Heading level={5}>
          {merchantName}
        </Heading>
      </VStack>

      <Spacer />

      {/* Logout Button */}
      <Button variant="primary" onClick={handleSignOut}>
        Sign Out
      </Button>
    </VStack>
  )
}
