<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import axios from 'axios'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { apiClient } from '@/api/client'
import type { EintragAenderung, Einkaufslisteneintrag, Feldfehler } from '@/types'

const props = defineProps<{
  eintrag: Einkaufslisteneintrag
}>()

const emit = defineEmits<{
  gespeichert: [eintrag: Einkaufslisteneintrag]
  abgebrochen: []
  loeschen: []
}>()

const name = ref(props.eintrag.name)
const stueckzahl = ref<number | null>(props.eintrag.stueckzahl)
const feldfehler = ref<Feldfehler>({})
const fehler = ref(false)
const sendet = ref(false)
const namensfeld = useTemplateRef<{ $el: HTMLInputElement }>('namensfeld')

onMounted(() => namensfeld.value?.$el.focus())

async function speichern() {
  feldfehler.value = {}
  fehler.value = false
  sendet.value = true
  const aenderung: EintragAenderung = {
    name: name.value,
    stueckzahl: stueckzahl.value ?? 0,
    erledigt: props.eintrag.erledigt,
  }
  try {
    const response = await apiClient.put<Einkaufslisteneintrag>(
      `/api/einkaufsliste/${props.eintrag.id}`,
      aenderung,
    )
    emit('gespeichert', response.data)
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
  <form
    class="bearbeiten"
    novalidate
    @submit.prevent="speichern"
    @keydown.esc="emit('abgebrochen')"
  >
    <div class="feld feld-name">
      <label :for="`name-${eintrag.id}`">Name</label>
      <InputText
        :id="`name-${eintrag.id}`"
        ref="namensfeld"
        v-model="name"
        :invalid="!!feldfehler.name"
        fluid
      />
      <Message v-if="feldfehler.name" severity="error" size="small" variant="simple">
        {{ feldfehler.name }}
      </Message>
    </div>
    <div class="feld feld-stueckzahl">
      <label :for="`stueckzahl-${eintrag.id}`">Stück</label>
      <InputNumber
        v-model="stueckzahl"
        :input-id="`stueckzahl-${eintrag.id}`"
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
    <Message v-if="fehler" severity="error" class="gesamtfehler">
      Die Änderung wurde nicht gespeichert. Prüfe die Verbindung und versuche es noch einmal.
    </Message>
    <div class="knoepfe">
      <Button type="submit" label="Speichern" :loading="sendet" />
      <Button
        type="button"
        label="Abbrechen"
        severity="secondary"
        text
        @click="emit('abgebrochen')"
      />
      <Button
        type="button"
        label="Löschen"
        icon="pi pi-trash"
        severity="danger"
        text
        class="loeschen"
        @click="emit('loeschen')"
      />
    </div>
  </form>
</template>

<style scoped>
.bearbeiten {
  display: grid;
  grid-template-columns: 1fr 9rem;
  grid-template-areas:
    'name name'
    'stueckzahl .'
    'fehler fehler'
    'knoepfe knoepfe';
  gap: 0.75rem 1rem;
  padding: 0.75rem 0 1rem;
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

.gesamtfehler {
  grid-area: fehler;
}

.knoepfe {
  grid-area: knoepfe;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.loeschen {
  margin-left: auto;
}

@media (min-width: 768px) {
  .bearbeiten {
    grid-template-columns: 1fr 9rem;
    grid-template-areas:
      'name stueckzahl'
      'fehler fehler'
      'knoepfe knoepfe';
  }
}
</style>
