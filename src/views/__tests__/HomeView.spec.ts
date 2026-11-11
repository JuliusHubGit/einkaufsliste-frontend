import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import RezeptFormular from '@/components/RezeptFormular.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn<(url: string) => Promise<unknown>>(),
    delete: vi.fn<(url: string) => Promise<unknown>>(),
    post: vi.fn<(url: string, data: unknown) => Promise<unknown>>(),
  },
}))

const beispielRezepte = [
  {
    id: 1,
    titel: 'Spaghetti Carbonara',
    portionen: 2,
    schwierigkeit: 'NORMAL',
    zutaten: [],
    besitzer: 'demo',
  },
  {
    id: 2,
    titel: 'Linsensuppe',
    portionen: 4,
    schwierigkeit: 'NORMAL',
    zutaten: [],
    besitzer: 'demo',
  },
]

describe('HomeView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('laedt Rezepte vom Backend und zeigt sie an', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [
        {
          id: 1,
          titel: 'Spaghetti Carbonara',
          portionen: 2,
          schwierigkeit: 'NORMAL',
          zutaten: [],
          besitzer: 'demo',
        },
      ],
    })

    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await flushPromises()

    expect(wrapper.text()).toContain('Spaghetti Carbonara')
    expect(apiClient.get).toHaveBeenCalledWith('/api/rezepte')
  })

  it('zeigt eine Fehlermeldung, wenn das Backend nicht erreichbar ist', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await flushPromises()

    expect(wrapper.text()).toContain('Die Rezepte konnten nicht geladen werden')
  })

  it('entfernt ein Rezept nach erfolgreichem Loeschen aus der Liste', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: beispielRezepte })
    vi.mocked(apiClient.delete).mockResolvedValue({ status: 204 })

    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await flushPromises()
    await wrapper.get('button[aria-label="Linsensuppe löschen"]').trigger('click')
    await flushPromises()

    expect(apiClient.delete).toHaveBeenCalledWith('/api/rezepte/2')
    expect(wrapper.text()).not.toContain('Linsensuppe')
    expect(wrapper.text()).toContain('Spaghetti Carbonara')
  })

  it('behaelt das Rezept und zeigt eine Fehlermeldung, wenn Loeschen fehlschlaegt', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: beispielRezepte })
    vi.mocked(apiClient.delete).mockRejectedValue(new Error('Not Found'))

    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await flushPromises()
    await wrapper.get('button[aria-label="Linsensuppe löschen"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Linsensuppe')
    expect(wrapper.text()).toContain('Das Rezept konnte nicht gelöscht werden')
  })

  it('zeigt ein neu angelegtes Rezept in der Liste und schliesst das Formular', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: beispielRezepte })

    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await flushPromises()
    await wrapper.get('button[aria-label="Neues Rezept"]').trigger('click')
    wrapper.findComponent(RezeptFormular).vm.$emit('angelegt', {
      id: 3,
      titel: 'Pfannkuchen',
      portionen: 2,
      schwierigkeit: 'EINFACH',
      zutaten: [],
      besitzer: 'demo',
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Pfannkuchen')
    expect(wrapper.findComponent(RezeptFormular).exists()).toBe(false)
  })
})
