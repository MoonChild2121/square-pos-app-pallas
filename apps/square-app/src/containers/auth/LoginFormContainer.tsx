'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { LoginForm } from '@/components/composites/auth/LoginForm'
import { Flex } from '@styled-system/jsx'

export function LoginFormContainer() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('square', { callbackUrl: '/menu' })
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Flex align="center" justify="center" h="100vh">
      <LoginForm
        isLoading={isLoading}
        onSignIn={handleSignIn}
      />
    </Flex>
  )
}
