<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EinkaufslisteListe from '@/components/EinkaufslisteListe.vue'
import EinkaufslistenFormular from '@/components/EinkaufslistenFormular.vue'
import { apiClient } from '@/api/client'
import type { EintragAenderung, Einkaufslisteneintrag } from '@/types'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const eintraege = ref<Einkaufslisteneintrag[]>([])
const laedt = ref(true)
const fehler = ref(false)
const speicherFehler = ref(false)
const aenderungsFehler = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await apiClient.get<Einkaufslisteneintrag[]>('/api/einkaufsliste')
    eintraege.value = response.data
  } catch {
    fehler.value = true
  } finally {
    laedt.value = false
  }
})

function eintragAngelegt(eintrag: Einkaufslisteneintrag) {
  eintraege.value = [...eintraege.value, eintrag]
}

function ersetzen(geaendert: Einkaufslisteneintrag) {
  eintraege.value = eintraege.value.map((eintrag) =>
    eintrag.id === geaendert.id ? geaendert : eintrag,
  )
}

async function abhaken(eintrag: Einkaufslisteneintrag) {
  aenderungsFehler.value = null
  const aenderung: EintragAenderung = {
    name: eintrag.name,
    stueckzahl: eintrag.stueckzahl,
    erledigt: !eintrag.erledigt,
  }
  try {
    const response = await apiClient.put<Einkaufslisteneintrag>(
      `/api/einkaufsliste/${eintrag.id}`,
      aenderung,
    )
    ersetzen(response.data)
  } catch {
    aenderungsFehler.value = `„${eintrag.name}“ konnte nicht abgehakt werden.`
  }
}

async function loeschen(id: number) {
  aenderungsFehler.value = null
  try {
    await apiClient.delete(`/api/einkaufsliste/${id}`)
    eintraege.value = eintraege.value.filter((eintrag) => eintrag.id !== id)
  } catch {
    aenderungsFehler.value = 'Der Eintrag konnte nicht gelöscht werden.'
  }
}

async function reihenfolgeSpeichern(ids: number[]) {
  speicherFehler.value = false
  try {
    const response = await apiClient.put<Einkaufslisteneintrag[]>(
      '/api/einkaufsliste/reihenfolge',
      ids,
    )
    eintraege.value = response.data
  } catch {
    speicherFehler.value = true
    // Lokale Reihenfolge auf den letzten bekannten Stand zuruecksetzen
    eintraege.value = [...eintraege.value]
  }
}
</script>

<template>
  <main class="seite">
    <h1>Einkaufsliste</h1>
    <ProgressSpinner v-if="laedt" />
    <Message v-else-if="fehler" severity="error">
      Die Einkaufsliste konnte nicht geladen werden.
    </Message>
    <template v-else>
      <EinkaufslistenFormular @angelegt="eintragAngelegt" />
      <Message v-if="speicherFehler" severity="warn">
        Die neue Reihenfolge konnte nicht gespeichert werden.
      </Message>
      <Message v-if="aenderungsFehler" severity="error">{{ aenderungsFehler }}</Message>
      <EinkaufslisteListe
        :eintraege="eintraege"
        @umsortiert="reihenfolgeSpeichern"
        @abhaken="abhaken"
        @loeschen="loeschen"
        @gespeichert="ersetzen"
      />
    </template>
  </main>
</template>

<style scoped>
.seite {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
