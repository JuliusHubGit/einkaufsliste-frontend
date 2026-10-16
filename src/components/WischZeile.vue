<script setup lang="ts">
import { ref } from 'vue'

// Wischen nach links ueber die Schwelle hinaus meldet "gewischt" (zum Loeschen).
// Nur fuer Touch/Stift: mit der Maus wird nicht gewischt, dafuer gibt es den Loeschen-Knopf.
const props = withDefaults(defineProps<{ schwelle?: number }>(), { schwelle: 96 })

const emit = defineEmits<{
  gewischt: []
}>()

const versatz = ref(0)
const zieht = ref(false)
let start: { x: number; y: number } | null = null
let klickUnterdruecken = false

function runter(e: PointerEvent) {
  if (e.pointerType === 'mouse') return
  start = { x: e.clientX, y: e.clientY }
  zieht.value = false
}

function bewegen(e: PointerEvent) {
  if (!start) return
  const dx = e.clientX - start.x
  const dy = e.clientY - start.y
  if (!zieht.value) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      // Senkrecht: der Nutzer scrollt, nicht wischen
      start = null
      return
    }
    if (Math.abs(dx) <= 10) return
    zieht.value = true
  }
  versatz.value = Math.min(0, dx)
}

function hoch() {
  if (!start) return
  start = null
  if (zieht.value) {
    klickUnterdruecken = true
    if (versatz.value <= -props.schwelle) {
      emit('gewischt')
    }
  }
  zieht.value = false
  versatz.value = 0
}

function abbrechen() {
  start = null
  zieht.value = false
  versatz.value = 0
}

function klick(e: MouseEvent) {
  // Nach dem Wischen keinen Klick auf den Inhalt ausloesen
  if (klickUnterdruecken) {
    e.stopPropagation()
    e.preventDefault()
    klickUnterdruecken = false
  }
}
</script>

<template>
  <div class="wisch-zeile">
    <div class="wisch-hintergrund" :class="{ bereit: versatz <= -schwelle }" aria-hidden="true">
      <i class="pi pi-trash" />
      Löschen
    </div>
    <div
      class="wisch-inhalt"
      :class="{ zieht }"
      :style="{ transform: `translateX(${versatz}px)` }"
      data-testid="wisch-inhalt"
      @pointerdown="runter"
      @pointermove="bewegen"
      @pointerup="hoch"
      @pointercancel="abbrechen"
      @click.capture="klick"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.wisch-zeile {
  position: relative;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.wisch-hintergrund {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-right: 1.25rem;
  background: var(--linie);
  color: var(--zinn);
  font-weight: 700;
}

.wisch-hintergrund.bereit {
  background: var(--paprika);
  color: #ffffff;
}

.wisch-inhalt {
  position: relative;
  background: var(--emaille);
  touch-action: pan-y;
  transition: transform 0.2s ease-out;
}

.wisch-inhalt.zieht {
  transition: none;
}
</style>
