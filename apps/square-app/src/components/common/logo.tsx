import { HStack } from '@styled-system/jsx'
import { css } from '@styled-system/css'

export function Logo() {
  return (
    <HStack gap="2">
      <div className={css({
        w: '32px',
        h: '32px',
        bg: 'bgSolid.hover',
        borderRadius: 'lg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'lg'
      })}>
        P
      </div>
      <span className={css({
        fontSize: 'lg',
        fontWeight: 'semibold',
        color: 'text',
        _dark: {
          color: 'white'
        }
      })}>
        Pallas Pay
      </span>
    </HStack>
  )
} 