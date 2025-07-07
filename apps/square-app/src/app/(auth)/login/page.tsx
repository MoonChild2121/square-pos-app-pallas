'use client';

import { LoginForm } from '@/components/auth/login-form'
import { MarketingSection } from '@/components/auth/marketing-section'
import { Logo } from '@/components/common/logo'
import { Flex, Box } from '@styled-system/jsx'
import { css } from '@styled-system/css'

export default function LoginPage() {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      minH="100vh"
      className={css({
        bg: { base: 'surface.spotlight', md: 'initial' },
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/memphis-mini-dark.png")',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'overlay',
          opacity: { base: 1, md: 0 },
          zIndex: -1,
          pointerEvents: 'none'
        }
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
        flex={{ base: '1', md: '0.85' }}
        h={{ base: '100vh', md: '100vh' }}
        bg={{ base: 'surface.layout', md: 'surface.container' }}
        align="center"
        justify="center"
        p="layout.section.lg"
      >
        <LoginForm />
      </Flex>

      <Flex
        className={css({
          display: { base: 'none', md: 'flex' },
          bg: 'surface.spotlight',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/memphis-mini-dark.png")',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'overlay',
            opacity: 0.7,
            zIndex: 0,
            pointerEvents: 'none'
          }
        })}
        flex="1.5"
        h="100vh"
        align="center"
        justify="center"
        p="layout.section.lg"
        position="relative"
      >
        <Box position="relative" className={css({ zIndex: 1 })}>
          <MarketingSection />
        </Box>
      </Flex>
    </Flex>
  )
}
