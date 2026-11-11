import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RezeptDetail from '../RezeptDetail.vue'
import type { Rezept } from '@/types'

const mehl = { id: 1, name: 'Mehl', menge: 200, einheit: 'g' }
const milch = { id: 2, name: 'Milch', menge: 0.25, einheit: 'l' }

const pfannkuchen: Rezept = {
  id: 1,
  titel: 'Pfannkuchen',
  portionen: 4,
  schwierigkeit: 'EINFACH',
  zutaten: [mehl, milch],
  schritte: [
    {
      id: 1,
      position: 1,
      beschreibung: 'Mehl und Milch verrühren',
      zutaten: [
        { id: 1, zutat: mehl },
        { id: 2, zutat: milch },
      ],
    },
    { id: 2, position: 2, beschreibung: 'Ausbacken', zutaten: [] },
  ],
  besitzer: 'demo',
}

describe('RezeptDetail', () => {
  it('zeigt Titel, Portionen und Schwierigkeit im Kopf', () => {
    const wrapper = mount(RezeptDetail, { props: { rezept: pfannkuchen } })

    expect(wrapper.get('h1').text()).toBe('Pfannkuchen')
    expect(wrapper.get('.rezept-kopf').text()).toContain('4 Portionen')
    expect(wrapper.get('.rezept-kopf .plakette').text()).toBe('Einfach')
  })

  it('zeigt die Zutaten mit deutsch formatierter Menge', () => {
    const wrapper = mount(RezeptDetail, { props: { rezept: pfannkuchen } })

    expect(
      wrapper
        .findAll('.zutat')
        .map((zeile) => zeile.findAll('span').map((spalte) => spalte.text())),
    ).toEqual([
      ['200 g', 'Mehl'],
      ['0,25 l', 'Milch'],
    ])
  })

  it('zeigt die Schritte in Reihenfolge mit ihren Zutaten', () => {
    const wrapper = mount(RezeptDetail, { props: { rezept: pfannkuchen } })

    const schritte = wrapper.findAll('.schritt')
    expect(schritte.map((schritt) => schritt.get('.beschreibung').text())).toEqual([
      'Mehl und Milch verrühren',
      'Ausbacken',
    ])
    expect(schritte[0]!.findAll('.schritt-zutaten li').map((li) => li.text())).toEqual([
      'Mehl',
      'Milch',
    ])
    expect(schritte[1]!.find('.schritt-zutaten').exists()).toBe(false)
  })

  it('zeigt Leerzustaende ohne Zutaten und Schritte', () => {
    const wrapper = mount(RezeptDetail, {
      props: { rezept: { ...pfannkuchen, zutaten: [], schritte: [] } },
    })

    expect(wrapper.text()).toContain('Keine Zutaten erfasst.')
    expect(wrapper.text()).toContain('Keine Schritte erfasst.')
  })
})
