import { describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import WischZeile from '../WischZeile.vue'

// jsdom kennt kein PointerEvent: MouseEvent mit nachgeruestetem pointerType
function zeiger(typ: string, x: number, y: number, pointerType: string) {
  const event = new MouseEvent(typ, { bubbles: true, clientX: x, clientY: y })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  return event
}

async function wischen(
  wrapper: VueWrapper,
  dx: number,
  { dy = 0, pointerType = 'touch' }: { dy?: number; pointerType?: string } = {},
) {
  const inhalt = wrapper.get('[data-testid="wisch-inhalt"]').element
  inhalt.dispatchEvent(zeiger('pointerdown', 300, 100, pointerType))
  inhalt.dispatchEvent(zeiger('pointermove', 300 + dx / 2, 100 + dy / 2, pointerType))
  inhalt.dispatchEvent(zeiger('pointermove', 300 + dx, 100 + dy, pointerType))
  inhalt.dispatchEvent(zeiger('pointerup', 300 + dx, 100 + dy, pointerType))
  await wrapper.vm.$nextTick()
}

describe('WischZeile', () => {
  it('meldet "gewischt", wenn weit genug nach links gewischt wird', async () => {
    const wrapper = mount(WischZeile, { slots: { default: 'Milch' } })
    await wischen(wrapper, -150)
    expect(wrapper.emitted('gewischt')).toHaveLength(1)
  })

  it('schnappt bei kurzem Wischen zurueck, ohne zu melden', async () => {
    const wrapper = mount(WischZeile, { slots: { default: 'Milch' } })
    await wischen(wrapper, -40)
    expect(wrapper.emitted('gewischt')).toBeUndefined()
    expect(wrapper.get('[data-testid="wisch-inhalt"]').attributes('style')).toContain(
      'translateX(0px)',
    )
  })

  it('ignoriert senkrechtes Scrollen und Wischen nach rechts', async () => {
    const wrapper = mount(WischZeile, { slots: { default: 'Milch' } })
    await wischen(wrapper, -20, { dy: 200 })
    await wischen(wrapper, 200)
    expect(wrapper.emitted('gewischt')).toBeUndefined()
  })

  it('reagiert nicht auf die Maus', async () => {
    const wrapper = mount(WischZeile, { slots: { default: 'Milch' } })
    await wischen(wrapper, -150, { pointerType: 'mouse' })
    expect(wrapper.emitted('gewischt')).toBeUndefined()
  })
})
