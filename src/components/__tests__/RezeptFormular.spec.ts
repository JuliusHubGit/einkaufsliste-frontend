import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import RezeptFormular from '../RezeptFormular.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    post: vi.fn<(url: string, data: unknown) => Promise<unknown>>(),
  },
}))

const pfannkuchen = {
  id: 3,
  titel: 'Pfannkuchen',
  portionen: 4,
  schwierigkeit: 'EINFACH',
  zutaten: [{ id: 1, name: 'Mehl', menge: 200, einheit: 'g' }],
  besitzer: 'demo',
}

function feld(wrapper: VueWrapper, id: string) {
  return wrapper.findAllComponents(InputText).find((eingabe) => eingabe.attributes('id') === id)!
}

function zahl(wrapper: VueWrapper, id: string) {
  return wrapper.findAllComponents(InputNumber).find((eingabe) => eingabe.props('inputId') === id)!
}

async function absenden(wrapper: VueWrapper) {
  await wrapper.get('form').trigger('submit')
  await flushPromises()
}

describe('RezeptFormular', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset()
  })

  it('schickt Titel, Portionen, Schwierigkeit und Zutaten an das Backend', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 201, data: pfannkuchen })
    const wrapper = mount(RezeptFormular)

    feld(wrapper, 'rezept-titel').vm.$emit('update:modelValue', 'Pfannkuchen')
    zahl(wrapper, 'rezept-portionen').vm.$emit('update:modelValue', 4)
    wrapper.findComponent(SelectButton).vm.$emit('update:modelValue', 'EINFACH')
    await wrapper.get('button[aria-label="Zutat hinzufügen"]').trigger('click')
    feld(wrapper, 'zutat-0-name').vm.$emit('update:modelValue', 'Mehl')
    zahl(wrapper, 'zutat-0-menge').vm.$emit('update:modelValue', 200)
    feld(wrapper, 'zutat-0-einheit').vm.$emit('update:modelValue', 'g')
    await absenden(wrapper)

    expect(apiClient.post).toHaveBeenCalledWith('/api/rezepte', {
      titel: 'Pfannkuchen',
      portionen: 4,
      schwierigkeit: 'EINFACH',
      zutaten: [{ name: 'Mehl', menge: 200, einheit: 'g' }],
    })
    expect(wrapper.emitted('angelegt')).toEqual([[pfannkuchen]])
  })

  it('waehlt standardmaessig die Schwierigkeit Normal', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 201, data: pfannkuchen })
    const wrapper = mount(RezeptFormular)

    expect(wrapper.findComponent(SelectButton).props('modelValue')).toBe('NORMAL')
    await absenden(wrapper)

    expect(vi.mocked(apiClient.post).mock.calls[0]![1]).toMatchObject({ schwierigkeit: 'NORMAL' })
  })

  it('entfernt eine Zutatenzeile wieder', async () => {
    const wrapper = mount(RezeptFormular)

    await wrapper.get('button[aria-label="Zutat hinzufügen"]').trigger('click')
    await wrapper.get('button[aria-label="Zutat hinzufügen"]').trigger('click')
    await wrapper.get('button[aria-label="Zutat 1 entfernen"]').trigger('click')

    expect(wrapper.findAll('.zutat')).toHaveLength(1)
  })

  it('zeigt die Feldfehler aus dem Backend an, auch an den Zutaten', async () => {
    vi.mocked(apiClient.post).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          feldfehler: {
            titel: 'Bitte einen Titel eingeben',
            'zutaten[0].menge': 'Die Menge muss größer als 0 sein',
          },
        },
      },
    })
    const wrapper = mount(RezeptFormular)

    await wrapper.get('button[aria-label="Zutat hinzufügen"]').trigger('click')
    await absenden(wrapper)

    expect(wrapper.text()).toContain('Bitte einen Titel eingeben')
    expect(wrapper.text()).toContain('Die Menge muss größer als 0 sein')
    expect(feld(wrapper, 'rezept-titel').props('invalid')).toBe(true)
    expect(wrapper.emitted('angelegt')).toBeUndefined()
  })

  it('meldet einen allgemeinen Fehler, wenn das Backend nicht erreichbar ist', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network Error'))
    const wrapper = mount(RezeptFormular)

    await absenden(wrapper)

    expect(wrapper.text()).toContain('Das Rezept wurde nicht gespeichert')
  })

  it('meldet Abbrechen', async () => {
    const wrapper = mount(RezeptFormular)

    await wrapper.get('button[aria-label="Abbrechen"]').trigger('click')

    expect(wrapper.emitted('abgebrochen')).toHaveLength(1)
  })
})
