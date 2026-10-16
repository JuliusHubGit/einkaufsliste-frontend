import { describe, it, expect } from 'vitest'

import { mount, RouterLinkStub } from '@vue/test-utils'
import RezeptListe from '../RezeptListe.vue'
import type { Rezept } from '@/types'

const beispielRezepte: Rezept[] = [
  { id: 1, titel: 'Spaghetti Carbonara', portionen: 2, besitzer: 'demo' },
  { id: 2, titel: 'Linsensuppe', portionen: 4, besitzer: 'demo' },
]

describe('RezeptListe', () => {
  it('zeigt die Namen der Rezepte an', () => {
    const wrapper = mount(RezeptListe, {
      props: { rezepte: beispielRezepte },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Spaghetti Carbonara')
    expect(wrapper.text()).toContain('Linsensuppe')
  })

  it('verlinkt jedes Rezept auf seine Detailseite', () => {
    const wrapper = mount(RezeptListe, {
      props: { rezepte: beispielRezepte },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links.map((link) => link.props('to'))).toEqual([
      { name: 'rezept-detail', params: { id: 1 } },
      { name: 'rezept-detail', params: { id: 2 } },
    ])
  })

  it('zeigt einen Leerzustand, wenn keine Rezepte vorhanden sind', () => {
    const wrapper = mount(RezeptListe, { props: { rezepte: [] } })
    expect(wrapper.text()).toContain('Keine Rezepte vorhanden')
  })

  it('meldet die Id des Rezepts, wenn Loeschen geklickt wird', async () => {
    const wrapper = mount(RezeptListe, {
      props: { rezepte: beispielRezepte },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    await wrapper.get('button[aria-label="Linsensuppe löschen"]').trigger('click')

    expect(wrapper.emitted('loeschen')).toEqual([[2]])
  })
})
