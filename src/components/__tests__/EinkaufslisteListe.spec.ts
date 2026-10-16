import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EinkaufslisteListe from '../EinkaufslisteListe.vue'
import type { Einkaufslisteneintrag } from '@/types'

const beispielEintraege: Einkaufslisteneintrag[] = [
  {
    id: 1,
    name: 'Spaghetti',
    stueckzahl: 1,
    rezeptmenge: '200 g',
    reihenfolge: 1,
    erledigt: false,
    besitzer: 'demo',
  },
  {
    id: 2,
    name: 'Milch',
    stueckzahl: 2,
    rezeptmenge: null,
    reihenfolge: 2,
    erledigt: false,
    besitzer: 'demo',
  },
  {
    id: 3,
    name: 'Linsen',
    stueckzahl: 1,
    rezeptmenge: null,
    reihenfolge: 3,
    erledigt: true,
    besitzer: 'demo',
  },
]

describe('EinkaufslisteListe', () => {
  it('zeigt offene Eintraege mit Stueckzahl und Rezeptmenge', () => {
    const wrapper = mount(EinkaufslisteListe, { props: { eintraege: beispielEintraege } })
    const offene = wrapper.findAll('li.eintrag:not(.erledigt)')

    expect(offene.map((li) => li.find('.name').text())).toEqual(['Spaghetti', 'Milch'])
    expect(offene[0]!.text()).toContain('1×')
    expect(offene[0]!.text()).toContain('200 g')
    expect(offene[1]!.text()).toContain('2×')
  })

  it('zeigt erledigte Eintraege abgesetzt', () => {
    const wrapper = mount(EinkaufslisteListe, { props: { eintraege: beispielEintraege } })

    expect(wrapper.text()).toContain('Erledigt')
    expect(wrapper.findAll('li.erledigt').map((li) => li.find('.name').text())).toEqual(['Linsen'])
  })

  it('meldet nach dem Verschieben die neue Reihenfolge inklusive erledigter Eintraege', async () => {
    const wrapper = mount(EinkaufslisteListe, { props: { eintraege: beispielEintraege } })
    const liste = wrapper.findComponent({ name: 'draggable' })

    liste.vm.$emit('update:modelValue', [beispielEintraege[1], beispielEintraege[0]])
    liste.vm.$emit('end')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('umsortiert')).toEqual([[[2, 1, 3]]])
  })

  it('zeigt einen Leerzustand, wenn die Liste leer ist', () => {
    const wrapper = mount(EinkaufslisteListe, { props: { eintraege: [] } })
    expect(wrapper.text()).toContain('Die Einkaufsliste ist leer')
  })
})
