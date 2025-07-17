'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/typography/heading'
import Paragraph from '@/components/ui/typography/paragraph'
import { Box, VStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import { LoginFormProps } from '@/shared/types/login'

export function LoginForm({ isLoading, onSignIn }: LoginFormProps) {
  return (
    <Box
      className={css({
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'lg',
        p: 'layout.section.md',
        maxW: '360px',
        w: '100%',
        _dark: {
          bg: 'surface.spotlight',
        },
      })}
    >
      <VStack gap="gap.component.lg" align="flex-start" w="100%">
        <VStack gap="gap.component.sm" w="100%" align="center">
          <Heading level={3}>Welcome Back</Heading>
          <Paragraph textAlign="center" color="secondary">
            Connect your Square account to get started
          </Paragraph>
        </VStack>

        <Button
          onClick={onSignIn}
          variant="primary"
          width="full"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading} 
        >
          {isLoading ? 'Processing' : 'Connect with Square'}
        </Button>
      </VStack>
    </Box>
  )
}
