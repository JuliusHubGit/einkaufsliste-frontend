<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'
import { apiClient } from '@/api/client'
import type { Einkaufslisteneintrag, Feldfehler, NeuerEintrag } from '@/types'

const emit = defineEmits<{
  angelegt: [eintrag: Einkaufslisteneintrag]
}>()

const name = ref('')
const stueckzahl = ref<number | null>(1)
const vorschlaege = ref<string[]>([])
const feldfehler = ref<Feldfehler>({})
const fehler = ref(false)
const sendet = ref(false)

async function vorschlaegeLaden(event: AutoCompleteCompleteEvent) {
  try {
    const response = await apiClient.get<string[]>('/api/einkaufsliste/vorschlaege', {
      params: { q: event.query },
    })
    vorschlaege.value = response.data
  } catch {
    // Ohne Vorschlaege laesst sich trotzdem eintragen
    vorschlaege.value = []
  }
}

async function hinzufuegen() {
  feldfehler.value = {}
  fehler.value = false
  sendet.value = true
  const neuerEintrag: NeuerEintrag = { name: name.value, stueckzahl: stueckzahl.value ?? 0 }
  try {
    const response = await apiClient.post<Einkaufslisteneintrag>('/api/einkaufsliste', neuerEintrag)
    emit('angelegt', response.data)
    name.value = ''
    stueckzahl.value = 1
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 400 && e.response.data?.feldfehler) {
      feldfehler.value = e.response.data.feldfehler
    } else {
      fehler.value = true
    }
  } finally {
    sendet.value = false
  }
}
</script>

<template>
  <form class="formular" novalidate @submit.prevent="hinzufuegen">
    <div class="feld feld-name">
      <label for="eintrag-name">Was fehlt?</label>
      <AutoComplete
        v-model="name"
        input-id="eintrag-name"
        :suggestions="vorschlaege"
        :invalid="!!feldfehler.name"
        :delay="200"
        fluid
        @complete="vorschlaegeLaden"
      />
      <Message v-if="feldfehler.name" severity="error" size="small" variant="simple">
        {{ feldfehler.name }}
      </Message>
    </div>
    <div class="feld feld-stueckzahl">
      <label for="eintrag-stueckzahl">Stück</label>
      <InputNumber
        v-model="stueckzahl"
        input-id="eintrag-stueckzahl"
        :invalid="!!feldfehler.stueckzahl"
        show-buttons
        button-layout="horizontal"
        fluid
      >
        <template #incrementbuttonicon><i class="pi pi-plus" aria-hidden="true" /></template>
        <template #decrementbuttonicon><i class="pi pi-minus" aria-hidden="true" /></template>
      </InputNumber>
      <Message v-if="feldfehler.stueckzahl" severity="error" size="small" variant="simple">
        {{ feldfehler.stueckzahl }}
      </Message>
    </div>
    <Button type="submit" label="Hinzufügen" icon="pi pi-plus" :loading="sendet" class="absenden" />
    <Message v-if="fehler" severity="error" class="gesamtfehler">
      Der Eintrag wurde nicht gespeichert. Prüfe die Verbindung und versuche es noch einmal.
    </Message>
  </form>
</template>

<style scoped>
.formular {
  display: grid;
  grid-template-columns: 1fr 9rem;
  grid-template-areas:
    'name name'
    'stueckzahl absenden'
    'fehler fehler';
  align-items: start;
  gap: 0.75rem 1rem;
}

.feld {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.feld label {
  font-weight: 600;
}

.feld-name {
  grid-area: name;
}

.feld-stueckzahl {
  grid-area: stueckzahl;
}

.feld-stueckzahl :deep(.p-inputnumber-input) {
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.absenden {
  grid-area: absenden;
  /* buendig mit den Eingabefeldern, unter der Beschriftung */
  margin-top: calc(1.5em + 0.35rem);
}

.gesamtfehler {
  grid-area: fehler;
}

@media (min-width: 768px) {
  .formular {
    grid-template-columns: 1fr 9rem auto;
    grid-template-areas:
      'name stueckzahl absenden'
      'fehler fehler fehler';
  }
}
</style>
