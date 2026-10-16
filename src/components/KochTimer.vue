<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'

const props = withDefaults(defineProps<{ startMinuten?: number }>(), {
  startMinuten: 5,
})

const minuten = ref(props.startMinuten)
// null = noch nicht gestartet bzw. zurueckgesetzt
const restSekunden = ref<number | null>(null)
const laeuft = ref(false)
let intervall: ReturnType<typeof setInterval> | undefined

const angezeigteSekunden = computed(() => restSekunden.value ?? minuten.value * 60)
const anzeige = computed(() => {
  const min = Math.floor(angezeigteSekunden.value / 60)
  const sek = angezeigteSekunden.value % 60
  return `${String(min).padStart(2, '0')}:${String(sek).padStart(2, '0')}`
})
const abgelaufen = computed(() => restSekunden.value === 0)

function anhalten() {
  clearInterval(intervall)
  intervall = undefined
  laeuft.value = false
}

function starten() {
  if (laeuft.value || minuten.value <= 0) return
  if (restSekunden.value === null || restSekunden.value === 0) {
    restSekunden.value = minuten.value * 60
  }
  laeuft.value = true
  intervall = setInterval(() => {
    if (restSekunden.value !== null && restSekunden.value > 0) {
      restSekunden.value--
    }
    if (restSekunden.value === 0) {
      anhalten()
    }
  }, 1000)
}

function zuruecksetzen() {
  anhalten()
  restSekunden.value = null
}

onUnmounted(anhalten)
</script>

<template>
  <div class="timer">
    <label class="timer-eingabe">
      Minuten
      <InputNumber
        v-model="minuten"
        :min="1"
        :max="600"
        :disabled="laeuft || restSekunden !== null"
        show-buttons
      />
    </label>
    <p class="timer-anzeige" data-testid="timer-anzeige">{{ anzeige }}</p>
    <Message v-if="abgelaufen" severity="success">Zeit abgelaufen.</Message>
    <div class="timer-knoepfe">
      <Button v-if="!laeuft" label="Start" icon="pi pi-play" @click="starten" />
      <Button v-else label="Pause" icon="pi pi-pause" severity="secondary" @click="anhalten" />
      <Button label="Reset" icon="pi pi-refresh" outlined @click="zuruecksetzen" />
    </div>
  </div>
</template>

<style scoped>
.timer {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'anzeige eingabe'
    'meldung meldung'
    'knoepfe knoepfe';
  align-items: end;
  gap: 1rem;
}

.timer-anzeige {
  grid-area: anzeige;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  margin: 0;
}

.timer-eingabe {
  grid-area: eingabe;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--zinn);
  font-size: 0.875rem;
}

.timer-eingabe :deep(.p-inputnumber-input) {
  width: 6rem;
  font-variant-numeric: tabular-nums;
}

.timer :deep(.p-message) {
  grid-area: meldung;
}

.timer-knoepfe {
  grid-area: knoepfe;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
