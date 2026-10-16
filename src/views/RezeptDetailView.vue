<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import axios from 'axios'
import RezeptDetail from '@/components/RezeptDetail.vue'
import KochTimer from '@/components/KochTimer.vue'
import { apiClient } from '@/api/client'
import type { Rezept } from '@/types'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()
const rezept = ref<Rezept | null>(null)
const laedt = ref(true)
const nichtGefunden = ref(false)
const fehler = ref(false)

onMounted(async () => {
  try {
    const response = await apiClient.get<Rezept>(`/api/rezepte/${route.params.id}`)
    rezept.value = response.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      nichtGefunden.value = true
    } else {
      fehler.value = true
    }
  } finally {
    laedt.value = false
  }
})
</script>

<template>
  <main class="rezept-detail-view">
    <RouterLink to="/" class="zurueck">
      <i class="pi pi-arrow-left" aria-hidden="true" />
      Alle Rezepte
    </RouterLink>
    <ProgressSpinner v-if="laedt" />
    <Message v-else-if="nichtGefunden" severity="warn">Dieses Rezept gibt es nicht.</Message>
    <Message v-else-if="fehler" severity="error">Das Rezept konnte nicht geladen werden.</Message>
    <template v-else-if="rezept">
      <RezeptDetail :rezept="rezept" />
      <section class="timer-feld" aria-labelledby="timer-titel">
        <h2 id="timer-titel">Timer</h2>
        <KochTimer />
      </section>
    </template>
  </main>
</template>

<style scoped>
.rezept-detail-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.zurueck {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--zinn);
  text-decoration: none;
}

.zurueck:hover {
  color: var(--tinte);
}

.timer-feld {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--flaeche);
  border: var(--rand) solid var(--kobalt);
  border-radius: var(--rundung);
}
</style>
