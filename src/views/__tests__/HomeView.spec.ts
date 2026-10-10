import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { apiClient } from '@/api/client'

vi.mock('@/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

describe('HomeView', () => {
  it('laedt Rezepte vom Backend und zeigt sie an', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ id: 1, titel: 'Spaghetti Carbonara', portionen: 2, besitzer: 'demo' }],
    })

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(wrapper.text()).toContain('Spaghetti Carbonara')
    expect(apiClient.get).toHaveBeenCalledWith('/api/rezepte')
  })
})
