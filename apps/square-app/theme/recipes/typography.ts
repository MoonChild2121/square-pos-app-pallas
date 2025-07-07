import { defineRecipe } from '@pandacss/dev'

export const heading = defineRecipe({
  className: 'heading',
  base: {
    fontFamily: 'heading',
    color: 'text',
    margin: 0,
  },
  variants: {
    level: {
      1: { fontSize: '4xl', fontWeight: 'bold', lineHeight: '1.2' },
      2: { fontSize: '3xl', fontWeight: 'bold', lineHeight: '1.2' },
      3: { fontSize: '2xl', fontWeight: 'semibold', lineHeight: '1.3' },
      4: { fontSize: 'xl', fontWeight: 'semibold', lineHeight: '1.4' },
      5: { fontSize: 'lg', fontWeight: 'medium', lineHeight: '1.5' },
      6: { fontSize: 'md', fontWeight: 'medium', lineHeight: '1.5' },
    },
    variant: {
      normal: {},
      accent: { color: 'primary' },
    },
    color: {
      default: { color: 'text' },
      secondary: { color: 'text.secondary' },
      disabled: { color: 'text.disabled' },
    },
  },
  defaultVariants: {
    level: 1,
    variant: 'normal',
    color: 'default',
  },
})

export const paragraph = defineRecipe({
  className: 'paragraph',
  base: {
    fontFamily: 'body',
    color: 'text',
    margin: 0,
    lineHeight: '1.6',
  },
  variants: {
    size: {
      sm: { fontSize: 'sm' },
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' },
    },
    color: {
      default: { color: 'text' },
      secondary: { color: 'text.secondary' },
      disabled: { color: 'text.disabled' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
}) 