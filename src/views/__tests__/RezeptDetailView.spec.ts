import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import RezeptDetailView from '../RezeptDetailView.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn<(url: string) => Promise<unknown>>() },
}))

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ params: { id: '1' } }),
}))

const global = { stubs: { RouterLink: RouterLinkStub } }

describe('RezeptDetailView', () => {
  it('laedt das Rezept zur Id aus der Route und zeigt es an', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { id: 1, titel: 'Spaghetti Carbonara', portionen: 2, besitzer: 'demo' },
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
})
