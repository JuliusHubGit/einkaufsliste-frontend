import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KochTimer from '../KochTimer.vue'

function knopf(wrapper: ReturnType<typeof mount>, text: string) {
  const button = wrapper.findAll('button').find((b) => b.text() === text)
  if (!button) throw new Error(`Knopf "${text}" nicht gefunden`)
  return button
}

function anzeige(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('[data-testid="timer-anzeige"]').text()
}

describe('KochTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('zeigt vor dem Start die eingestellte Zeit', () => {
    const wrapper = mount(KochTimer, { props: { startMinuten: 2 } })
    expect(anzeige(wrapper)).toBe('02:00')
  })

  it('zaehlt nach Start herunter', async () => {
    const wrapper = mount(KochTimer, { props: { startMinuten: 1 } })

    await knopf(wrapper, 'Start').trigger('click')
    await vi.advanceTimersByTimeAsync(10_000)

    expect(anzeige(wrapper)).toBe('00:50')
  })

  it('haelt bei Pause an und laeuft danach weiter', async () => {
    const wrapper = mount(KochTimer, { props: { startMinuten: 1 } })

    await knopf(wrapper, 'Start').trigger('click')
    await vi.advanceTimersByTimeAsync(5_000)
    await knopf(wrapper, 'Pause').trigger('click')
    await vi.advanceTimersByTimeAsync(5_000)
    expect(anzeige(wrapper)).toBe('00:55')

    await knopf(wrapper, 'Start').trigger('click')
    await vi.advanceTimersByTimeAsync(5_000)
    expect(anzeige(wrapper)).toBe('00:50')
  })

  it('setzt bei Reset auf die eingestellte Zeit zurueck', async () => {
    const wrapper = mount(KochTimer, { props: { startMinuten: 1 } })

    await knopf(wrapper, 'Start').trigger('click')
    await vi.advanceTimersByTimeAsync(20_000)
    await knopf(wrapper, 'Reset').trigger('click')
    await vi.advanceTimersByTimeAsync(5_000)

    expect(anzeige(wrapper)).toBe('01:00')
    expect(knopf(wrapper, 'Start').exists()).toBe(true)
  })

  it('meldet, wenn die Zeit abgelaufen ist', async () => {
    const wrapper = mount(KochTimer, { props: { startMinuten: 1 } })

    await knopf(wrapper, 'Start').trigger('click')
    await vi.advanceTimersByTimeAsync(61_000)

    expect(anzeige(wrapper)).toBe('00:00')
    expect(wrapper.text()).toContain('Zeit abgelaufen')
  })
})
