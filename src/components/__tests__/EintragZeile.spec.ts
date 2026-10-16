import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from 'primevue/checkbox'
import EintragZeile from '../EintragZeile.vue'
import EintragBearbeiten from '../EintragBearbeiten.vue'

const spaghetti = {
  id: 1,
  name: 'Spaghetti',
  stueckzahl: 1,
  rezeptmenge: '200 g',
  reihenfolge: 1,
  erledigt: false,
  besitzer: 'demo',
}

describe('EintragZeile', () => {
  it('zeigt Stueckzahl, Name und Rezeptmenge', () => {
    const wrapper = mount(EintragZeile, { props: { eintrag: spaghetti } })
    expect(wrapper.text()).toContain('1×')
    expect(wrapper.text()).toContain('Spaghetti')
    expect(wrapper.text()).toContain('200 g')
  })

  it('meldet "abhaken", wenn die Checkbox umgeschaltet wird', async () => {
    const wrapper = mount(EintragZeile, { props: { eintrag: spaghetti } })
    wrapper.findComponent(Checkbox).vm.$emit('update:modelValue', true)
    expect(wrapper.emitted('abhaken')).toHaveLength(1)
  })

  it('meldet "loeschen" beim Klick auf den Loeschen-Knopf', async () => {
    const wrapper = mount(EintragZeile, { props: { eintrag: spaghetti } })
    await wrapper.get('button[aria-label="Spaghetti löschen"]').trigger('click')
    expect(wrapper.emitted('loeschen')).toHaveLength(1)
  })

  it('oeffnet beim Klick auf den Namen das Bearbeiten-Formular', async () => {
    const wrapper = mount(EintragZeile, { props: { eintrag: spaghetti } })
    await wrapper.get('button.beschreibung').trigger('click')
    expect(wrapper.findComponent(EintragBearbeiten).exists()).toBe(true)

    wrapper.findComponent(EintragBearbeiten).vm.$emit('abgebrochen')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(EintragBearbeiten).exists()).toBe(false)
  })
})
