import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EinkaufslisteView from '../EinkaufslisteView.vue'
import EinkaufslisteListe from '@/components/EinkaufslisteListe.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn<(url: string) => Promise<unknown>>(),
    put: vi.fn<(url: string, data: unknown) => Promise<unknown>>(),
  },
}))

const milch = {
  id: 1,
  name: 'Milch',
  stueckzahl: 2,
  rezeptmenge: null,
  reihenfolge: 1,
  erledigt: false,
  besitzer: 'demo',
}
const eier = { ...milch, id: 2, name: 'Eier', stueckzahl: 1, reihenfolge: 2 }

describe('EinkaufslisteView', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset()
    vi.mocked(apiClient.put).mockReset()
  })

  it('laedt die Einkaufsliste vom Backend und zeigt sie an', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [milch] })

    const wrapper = mount(EinkaufslisteView)
    await flushPromises()

    expect(apiClient.get).toHaveBeenCalledWith('/api/einkaufsliste')
    expect(wrapper.text()).toContain('Milch')
  })

  it('speichert die neue Reihenfolge ueber PUT', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [milch, eier] })
    vi.mocked(apiClient.put).mockResolvedValue({
      data: [
        { ...eier, reihenfolge: 1 },
        { ...milch, reihenfolge: 2 },
      ],
    })

    const wrapper = mount(EinkaufslisteView)
    await flushPromises()
    wrapper.findComponent(EinkaufslisteListe).vm.$emit('umsortiert', [2, 1])
    await flushPromises()

    expect(apiClient.put).toHaveBeenCalledWith('/api/einkaufsliste/reihenfolge', [2, 1])
    expect(wrapper.findAll('li .name').map((el) => el.text())).toEqual(['Eier', 'Milch'])
  })

  it('zeigt eine Fehlermeldung, wenn das Backend nicht erreichbar ist', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(EinkaufslisteView)
    await flushPromises()

    expect(wrapper.text()).toContain('Die Einkaufsliste konnte nicht geladen werden')
  })
})
