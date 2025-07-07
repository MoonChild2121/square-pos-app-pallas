import { createPreset } from '@pallas-ui/panda-preset'
import { defineConfig } from '@pandacss/dev'
import { presetPrimaryColors } from '@pallas-ui/panda-preset/colors/paletteGenerator'
import type { ThemeColorPalette } from '@pallas-ui/panda-preset/types'
import { button } from './src/theme/recipes/button'
import { heading, paragraph } from './src/theme/recipes/typography'
import { recipes } from './src/theme'

const themeColorPalette: ThemeColorPalette = {
  primary: { colorName: 'blue', colorValue: presetPrimaryColors['blue']! },
  error: { colorName: 'red', colorValue: presetPrimaryColors['red']! },
  success: { colorName: 'green', colorValue: presetPrimaryColors['green']! },
  warning: { colorName: 'yellow', colorValue: presetPrimaryColors['yellow']! },
  info: { colorName: 'blue', colorValue: presetPrimaryColors['blue']! },
}

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      recipes,
      tokens: {
        fonts: {
          heading: {
            value: 'var(--font-geist), system-ui, sans-serif',
          },
          body: {
            value: 'var(--font-geist), system-ui, sans-serif',
          },
          mono: {
            value: 'var(--font-geist-mono), monospace'
          }
        }
      }
    },
  },
  // The output directory for your css system
  outdir: "styled-system",
  jsxFramework: "react",
  jsxStyleProps: "minimal",
  presets: [
    createPreset({
      colors: themeColorPalette,
      baseRadius: 2,
    }),
  ]
});
