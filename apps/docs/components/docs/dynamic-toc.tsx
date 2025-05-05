'use client'

import { css } from '@styled-system/css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type TocItem = {
  id: string
  text: string
  level: number
  children: TocItem[]
}

export function DynamicToc() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const pathname = usePathname()

  // Generate TOC from the actual rendered DOM
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Function to build TOC from DOM
    function buildToc() {
      // Get the main content area
      const contentArea = document.querySelector('[data-mdx-content="true"]')
      if (!contentArea) return

      // Find all headings
      const headings = Array.from(contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(
        (el) => el.id && el.textContent,
      ) // Only include headings with IDs and content

      if (headings.length === 0) return

      const result: TocItem[] = []
      let currentH2: TocItem | null = null

      headings.forEach((heading) => {
        const level = Number.parseInt(heading.tagName?.[1] || '0', 10)
        const id = heading.id
        const text = heading.textContent?.trim() || ''

        if (level === 1) {
          // Skip h1 as it's usually the page title
          return
        }
        if (level === 2) {
          // New h2 heading
          currentH2 = { id, text, level, children: [] }
          result.push(currentH2)
        } else if (level === 3 && currentH2) {
          // h3 under current h2
          currentH2.children.push({ id, text, level, children: [] })
        } else if (level > 3) {
          // We don't show h4+ in the TOC to keep it clean
          return
        }
      })

      setToc(result)
    }

    // Initial build (in case content is already present)
    setTimeout(buildToc, 300)

    // Observe DOM changes in the content area
    const contentArea = document.querySelector('[data-mdx-content="true"]')
    let observer: MutationObserver | null = null

    if (contentArea) {
      observer = new MutationObserver(() => {
        buildToc()
      })
      observer.observe(contentArea, { childList: true, subtree: true })
    }

    // Also listen for window load
    window.addEventListener('load', buildToc)

    // Set up Intersection Observer for active heading tracking
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id)

        if (visibleHeadings.length > 0) {
          // Set the first visible heading as active
          setActiveId(visibleHeadings[0] || '')
        }
      },
      { rootMargin: '-100px 0px -70% 0px' },
    )

    // Observe all headings with IDs
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    headings.forEach((heading) => {
      intersectionObserver.observe(heading)
    })

    return () => {
      if (observer) observer.disconnect()
      window.removeEventListener('load', buildToc)
      intersectionObserver.disconnect()
    }
  }, [pathname])

  // Handle scroll to section
  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      // Update URL without reloading the page
      window.history.pushState({}, '', `#${id}`)

      // Scroll to the element with smooth behavior
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // Set active state
      setActiveId(id)
    }
  }

  if (toc.length === 0) return null

  return (
    <div>
      <div
        className={css({
          fontWeight: 'medium',
          mb: '5', // Changed from gap.component.md
          color: 'text',
          fontSize: 'lg', // to show level diff
        })}
      >
        On This Page
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4', // Changed from gap.inline.md
        })}
      >
        {toc.map((item) => (
          <div key={item.id}>
            <Link
              href={`#${item.id}`}
              onClick={scrollToSection(item.id)}
              className={css({
                display: 'inline-block',
                color: activeId === item.id ? 'primary' : 'text.secondary',
                textDecoration: 'none',
                fontSize: 'md', //changed from sm to show difference in toc levels
                fontWeight: activeId === item.id ? 'medium' : 'normal',
                _hover: { color: 'primary.hover' },
              })}
            >
              {item.text}
            </Link>

            {item.children.length > 0 && (
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1', // Changed from padding.inline.xs
                  mt: '1', // Changed from padding.inline.xs
                  ml: '3', // Changed from padding.inline.md
                })}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`#${child.id}`}
                    onClick={scrollToSection(child.id)}
                    className={css({
                      display: 'inline-block',
                      color: activeId === child.id ? 'primary' : 'text.tertiary',
                      textDecoration: 'none',
                      fontSize: 'sm', //xs looked too weird so left it as is
                      fontWeight: activeId === child.id ? 'medium' : 'normal',
                      _hover: { color: 'primary.hover' },
                    })}
                  >
                    {child.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
