import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import RezeptDetailView from '../RezeptDetailView.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn<(url: string) => Promise<unknown>>(),
    post: vi.fn<(url: string) => Promise<unknown>>(),
  },
}))

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ params: { id: '1' } }),
}))

const global = { stubs: { RouterLink: RouterLinkStub } }

const pfannkuchen = {
  id: 1,
  titel: 'Pfannkuchen',
  portionen: 2,
  schwierigkeit: 'EINFACH',
  zutaten: [{ id: 1, name: 'Mehl', menge: 200, einheit: 'g' }],
  schritte: [],
  besitzer: 'demo',
}

const uebernehmenKnopf = 'button[aria-label="Zutaten auf die Einkaufsliste"]'

describe('RezeptDetailView', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('laedt das Rezept zur Id aus der Route und zeigt es an', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        id: 1,
        titel: 'Spaghetti Carbonara',
        portionen: 2,
        schwierigkeit: 'NORMAL',
        zutaten: [],
        schritte: [],
        besitzer: 'demo',
      },
    })

    const wrapper = mount(RezeptDetailView, { global })
    await flushPromises()

    expect(apiClient.get).toHaveBeenCalledWith('/api/rezepte/1')
    expect(wrapper.text()).toContain('Spaghetti Carbonara')
    expect(wrapper.text()).toContain('Timer')
  })

  it('zeigt einen Hinweis, wenn das Rezept nicht existiert', async () => {
    vi.mocked(apiClient.get).mockRejectedValue({ isAxiosError: true, response: { status: 404 } })

    const wrapper = mount(RezeptDetailView, { global })
    await flushPromises()

    expect(wrapper.text()).toContain('Dieses Rezept gibt es nicht')
  })

  it('uebernimmt die Zutaten per Knopfdruck auf die Einkaufsliste', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: pfannkuchen })
    vi.mocked(apiClient.post).mockResolvedValue({ data: [] })
    const wrapper = mount(RezeptDetailView, { global })
    await flushPromises()

    await wrapper.get(uebernehmenKnopf).trigger('click')
    await flushPromises()

    expect(apiClient.post).toHaveBeenCalledWith('/api/rezepte/1/zutaten-hinzufuegen')
    expect(wrapper.text()).toContain('Die Zutaten stehen jetzt auf der Einkaufsliste.')
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
  })

  it('meldet einen Fehler, wenn die Uebernahme fehlschlaegt', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: pfannkuchen })
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network Error'))
    const wrapper = mount(RezeptDetailView, { global })
    await flushPromises()

    await wrapper.get(uebernehmenKnopf).trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Die Zutaten konnten nicht übernommen werden')
    expect(wrapper.text()).not.toContain('stehen jetzt auf der Einkaufsliste')
  })

  it('sperrt den Knopf bei einem Rezept ohne Zutaten', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { ...pfannkuchen, zutaten: [] } })
    const wrapper = mount(RezeptDetailView, { global })
    await flushPromises()

    expect(wrapper.get(uebernehmenKnopf).attributes('disabled')).toBeDefined()
  })
})
