import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import InputNumber from 'primevue/inputnumber'
import EintragBearbeiten from '../EintragBearbeiten.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    put: vi.fn<(url: string, data: unknown) => Promise<unknown>>(),
  },
}))

const spaghetti = {
  id: 1,
  name: 'Spaghetti',
  stueckzahl: 1,
  rezeptmenge: '200 g',
  reihenfolge: 1,
  erledigt: false,
  besitzer: 'demo',
}

describe('EintragBearbeiten', () => {
  beforeEach(() => {
    vi.mocked(apiClient.put).mockReset()
  })

  it('speichert Name und Stueckzahl und meldet den geaenderten Eintrag', async () => {
    const geaendert = { ...spaghetti, name: 'Vollkornspaghetti', stueckzahl: 2 }
    vi.mocked(apiClient.put).mockResolvedValue({ data: geaendert })
    const wrapper = mount(EintragBearbeiten, { props: { eintrag: spaghetti } })

    await wrapper.get('input#name-1').setValue('Vollkornspaghetti')
    wrapper.findComponent(InputNumber).vm.$emit('update:modelValue', 2)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(apiClient.put).toHaveBeenCalledWith('/api/einkaufsliste/1', {
      name: 'Vollkornspaghetti',
      stueckzahl: 2,
      erledigt: false,
    })
    expect(wrapper.emitted('gespeichert')).toEqual([[geaendert]])
  })

  it('zeigt Feldfehler aus dem Backend an', async () => {
    vi.mocked(apiClient.put).mockRejectedValue({
      isAxiosError: true,
      response: { status: 400, data: { feldfehler: { name: 'Bitte einen Namen eingeben' } } },
    })
    const wrapper = mount(EintragBearbeiten, { props: { eintrag: spaghetti } })

    await wrapper.get('input#name-1').setValue('')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Bitte einen Namen eingeben')
    expect(wrapper.emitted('gespeichert')).toBeUndefined()
  })

  it('meldet Abbrechen und Loeschen', async () => {
    const wrapper = mount(EintragBearbeiten, { props: { eintrag: spaghetti } })

    const knopf = (text: string) => wrapper.findAll('button').find((b) => b.text() === text)!
    await knopf('Abbrechen').trigger('click')
    await knopf('Löschen').trigger('click')

    expect(wrapper.emitted('abgebrochen')).toHaveLength(1)
    expect(wrapper.emitted('loeschen')).toHaveLength(1)
  })
})
