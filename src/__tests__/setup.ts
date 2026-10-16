import { config } from '@vue/test-utils'
import PrimeVue from 'primevue/config'

// PrimeVue-Komponenten wie InputNumber brauchen das registrierte Plugin
config.global.plugins = [PrimeVue]
