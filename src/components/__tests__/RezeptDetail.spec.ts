import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RezeptDetail from '../RezeptDetail.vue'

describe('RezeptDetail', () => {
  it('zeigt Titel und Portionen des Rezepts', () => {
    const wrapper = mount(RezeptDetail, {
      props: { rezept: { id: 1, titel: 'Linsensuppe', portionen: 4, besitzer: 'demo' } },
    })

    expect(wrapper.text()).toContain('Linsensuppe')
    expect(wrapper.text()).toContain('4 Portionen')
  })
})
