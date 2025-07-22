'use client'

import { useEffect } from 'react'
import { VStack, HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'
import Heading from '@/components/primitives/ui/typography/heading'
import Paragraph from '@/components/primitives/ui/typography/paragraph'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Menu page error:', error)
  }, [error])

  return (
    <VStack 
      gap="layout.default.md" 
      w="100vw" 
      h="100vh" 
      align="center" 
      justify="center" 
      p="padding.block.md" 
      className={css({ bg: 'surface.layout', textAlign: 'center' })}
    >
      {/* Cute Broken Robot/Chef Illustration */}
      <VStack align="center">
        <div className={css({ 
          fontSize: '4xl', 
          lineHeight: '1',
          filter: 'grayscale(0.3)',
          animation: 'bounce 2s ease-in-out infinite alternate'
        })}>
          🤖💔
        </div>

        <div className={css({ animation: 'pulse 1.5s ease-in-out infinite' })}>
          <Heading level={2}>•••</Heading>
        </div>
      </VStack>

      {/* Error Content */}
      <VStack gap="gap.inline.md" maxW="480px" align="center" justify="center" textAlign="center">
        <Heading level={2}>Oops! Our kitchen robot had a hiccup 🍳</Heading>

        <Paragraph>
          Don't worry, it's not your fault! Sometimes our little chef bot gets overwhelmed and needs a quick reboot. 
          We're already working on getting everything back to delicious!
        </Paragraph>
      </VStack>

      {/* Error Details (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={css({ 
          w: '100%', 
          maxW: '500px',
          p: '4', 
          bg: 'surface.card', 
          borderRadius: '12px',
          border: '1px dashed',
          borderColor: 'border.subtle'
        })}>
          <Paragraph className={css({
            fontFamily: 'mono',
            fontSize: 'sm',
            color: 'text.secondary',
            wordBreak: 'break-all'
          })}>
            🔧 Dev Info: {error?.message || 'Unknown error occurred'}
          </Paragraph>
        </div>
      )}

      {/* Action Buttons */}
      <HStack gap="4">
        <button
          onClick={() => reset()}
          className={css({
            px: 'padding.inline.md',
            py: 'padding.block.md',
            color: 'accent.contrast',
            borderRadius: 'lg',
            fontSize: 'md',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '1px solid',
            borderColor: 'border.default',
            _hover: {
              transform: 'translateY(-2px)',
            },
            display: 'inline-flex',
            alignItems: 'center',
          })}
        >
          <Heading level={5}>🔄 Try Again</Heading>
        </button>
      </HStack>

      {/* Support Message */}
      <Paragraph size="sm" className={css({ maxW: '400px' })}>
        Still having trouble? Our support team is standing by with virtual hugs and technical expertise! 🤗
      </Paragraph>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </VStack>
  )
}
