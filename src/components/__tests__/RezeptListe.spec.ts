import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import RezeptListe from '../RezeptListe.vue'
import type { Rezept } from '@/types'

const beispielRezepte: Rezept[] = [
  { id: 1, titel: 'Spaghetti Carbonara', portionen: 2, besitzer: 'demo' },
  { id: 2, titel: 'Linsensuppe', portionen: 4, besitzer: 'demo' },
]

describe('RezeptListe', () => {
  it('zeigt die Namen der Rezepte an', () => {
    const wrapper = mount(RezeptListe, { props: { rezepte: beispielRezepte } })
    expect(wrapper.text()).toContain('Spaghetti Carbonara')
    expect(wrapper.text()).toContain('Linsensuppe')
  })

  it('zeigt einen Leerzustand, wenn keine Rezepte vorhanden sind', () => {
    const wrapper = mount(RezeptListe, { props: { rezepte: [] } })
    expect(wrapper.text()).toContain('Keine Rezepte vorhanden')
  })

  it('meldet die Id des Rezepts, wenn Loeschen geklickt wird', async () => {
    const wrapper = mount(RezeptListe, { props: { rezepte: beispielRezepte } })

    await wrapper.get('button[aria-label="Linsensuppe löschen"]').trigger('click')

    expect(wrapper.emitted('loeschen')).toEqual([[2]])
  })
})
