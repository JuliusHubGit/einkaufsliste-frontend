import { config } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

// PrimeVue-Komponenten wie InputNumber brauchen das registrierte Plugin
config.global.plugins = [PrimeVue]

// jsdom kennt keinen ResizeObserver; Textarea mit auto-resize braucht ihn
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
