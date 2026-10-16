import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import AutoComplete from 'primevue/autocomplete'
import InputNumber from 'primevue/inputnumber'
import EinkaufslistenFormular from '../EinkaufslistenFormular.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn<(url: string, config?: unknown) => Promise<unknown>>(),
    post: vi.fn<(url: string, data: unknown) => Promise<unknown>>(),
  },
}))

const butter = {
  id: 5,
  name: 'Butter',
  stueckzahl: 2,
  rezeptmenge: null,
  reihenfolge: 5,
  erledigt: false,
  besitzer: 'demo',
}

async function ausfuellen(wrapper: VueWrapper, name: string, stueckzahl: number) {
  wrapper.findComponent(AutoComplete).vm.$emit('update:modelValue', name)
  wrapper.findComponent(InputNumber).vm.$emit('update:modelValue', stueckzahl)
  await wrapper.vm.$nextTick()
}

describe('EinkaufslistenFormular', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset()
    vi.mocked(apiClient.post).mockReset()
  })

  it('legt einen Eintrag an, meldet ihn und leert das Formular', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ status: 201, data: butter })
    const wrapper = mount(EinkaufslistenFormular)

    await ausfuellen(wrapper, 'Butter', 2)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(apiClient.post).toHaveBeenCalledWith('/api/einkaufsliste', {
      name: 'Butter',
      stueckzahl: 2,
    })
    expect(wrapper.emitted('angelegt')).toEqual([[butter]])
    expect(wrapper.findComponent(AutoComplete).props('modelValue')).toBe('')
    expect(wrapper.findComponent(InputNumber).props('modelValue')).toBe(1)
  })

  it('zeigt die Feldfehler aus dem Backend an', async () => {
    vi.mocked(apiClient.post).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          feldfehler: {
            name: 'Bitte einen Namen eingeben',
            stueckzahl: 'Die Stückzahl muss mindestens 1 sein',
          },
        },
      },
    })
    const wrapper = mount(EinkaufslistenFormular)

    await ausfuellen(wrapper, '', 0)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Bitte einen Namen eingeben')
    expect(wrapper.text()).toContain('Die Stückzahl muss mindestens 1 sein')
    expect(wrapper.findComponent(AutoComplete).props('invalid')).toBe(true)
    expect(wrapper.emitted('angelegt')).toBeUndefined()
  })

  it('meldet einen allgemeinen Fehler, wenn das Backend nicht erreichbar ist', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network Error'))
    const wrapper = mount(EinkaufslistenFormular)

    await ausfuellen(wrapper, 'Butter', 1)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Der Eintrag wurde nicht gespeichert')
  })

  it('laedt beim Tippen Namensvorschlaege', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: ['Milch'] })
    const wrapper = mount(EinkaufslistenFormular)

    wrapper.findComponent(AutoComplete).vm.$emit('complete', { query: 'mi' })
    await flushPromises()

    expect(apiClient.get).toHaveBeenCalledWith('/api/einkaufsliste/vorschlaege', {
      params: { q: 'mi' },
    })
    expect(wrapper.findComponent(AutoComplete).props('suggestions')).toEqual(['Milch'])
  })
})
