'use client'

import { Trigger as TriggerPrimitive } from '@pallas-ui/sidebar'
import { css, cx } from '@styled-system/css'
import { button } from '@styled-system/recipes'
import type { Assign } from '@styled-system/types'
import React, { useEffect, useState } from 'react'
import type { ButtonProps } from '../button'
import { withContext } from './provider'

type TriggerProps = Assign<React.ComponentProps<typeof TriggerPrimitive>, ButtonProps>

const TriggerStyled = withContext<React.ComponentRef<typeof TriggerPrimitive>, TriggerProps>(
  TriggerPrimitive,
  'trigger',
)

// Client-side only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <>{children}</>
}

export const Trigger = React.forwardRef<React.ComponentRef<typeof TriggerPrimitive>, TriggerProps>(
  (props, ref) => {
    const [buttonProps, { className, children, ...restProps }] = button.splitVariantProps(props)
    return (
      <ClientOnly>
        <TriggerStyled
          ref={ref}
          className={cx(button({ variant: 'text', ...buttonProps }), className)}
          {...restProps}
        >
          {children}
          <span className={css({ srOnly: true })}>Toggle Sidebar</span>
        </TriggerStyled>
      </ClientOnly>
    )
  },
)
Trigger.displayName = 'SidebarTrigger'
