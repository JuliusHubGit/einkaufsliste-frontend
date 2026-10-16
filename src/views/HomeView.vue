<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'
import { apiClient } from '@/api/client'
import type { Rezept } from '@/types'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const rezepte = ref<Rezept[]>([])
const laedt = ref(true)
const fehler = ref(false)

onMounted(async () => {
  try {
    const response = await apiClient.get<Rezept[]>('/api/rezepte')
    rezepte.value = response.data
  } catch {
    fehler.value = true
  } finally {
    laedt.value = false
  }
})
</script>

<template>
  <main>
    <h1>Meine Rezepte</h1>
    <ProgressSpinner v-if="laedt" />
    <Message v-else-if="fehler" severity="error">
      Die Rezepte konnten nicht geladen werden.
    </Message>
    <RezeptListe v-else :rezepte="rezepte" />
  </main>
</template>
