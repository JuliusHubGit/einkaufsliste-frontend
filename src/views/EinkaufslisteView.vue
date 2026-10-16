<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EinkaufslisteListe from '@/components/EinkaufslisteListe.vue'
import { apiClient } from '@/api/client'
import type { Einkaufslisteneintrag } from '@/types'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const eintraege = ref<Einkaufslisteneintrag[]>([])
const laedt = ref(true)
const fehler = ref(false)
const speicherFehler = ref(false)

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
      <Message v-if="speicherFehler" severity="warn">
        Die neue Reihenfolge konnte nicht gespeichert werden.
      </Message>
      <EinkaufslisteListe :eintraege="eintraege" @umsortiert="reihenfolgeSpeichern" />
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
