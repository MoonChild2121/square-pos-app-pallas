'use client';

import { LoginForm } from '@/components/auth/login-form'
import { Logo } from '@/components/common/logo'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'

export default function LoginPage() {
  return (
    <Flex
      direction="column"
      minH="100vh"
      className={css({
        bg: 'surface.layout',
        position: 'relative',
      })}
    >
      <Box className={css({
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 10
      })}>
        <Logo />
      </Box>

      <Flex
        flex="1"
        align="center"
        justify="center"
        p="layout.section.lg"
      >
        <LoginForm />
      </Flex>
    </Flex>
  )
}
