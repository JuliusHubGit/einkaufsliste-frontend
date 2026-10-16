import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Emaille: Aura mit Kobalt als Primaerfarbe. Im Dark Mode ist die Emaille
// dunkelblau und der "Rand" (Primaerfarbe) weiss.
export const Emaille = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef2fb',
      100: '#d5def4',
      200: '#aebfe8',
      300: '#7f98d8',
      400: '#5373c4',
      500: '#3456ab',
      600: '#1e3f8f',
      700: '#1a3577',
      800: '#172d62',
      900: '#14264f',
      950: '#0d1833',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#eef1f5',
          100: '#d6dbe6',
          200: '#a9b3c7',
          300: '#8592ad',
          400: '#637294',
          500: '#4a5a80',
          600: '#34456e',
          700: '#263863',
          800: '#1b2c56',
          900: '#14234a',
          950: '#0f1b3b',
        },
        primary: {
          color: '#f6f8f7',
          contrastColor: '{primary.800}',
          hoverColor: '{primary.100}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
})
