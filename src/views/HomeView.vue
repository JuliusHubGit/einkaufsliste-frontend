<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'
import { apiClient } from '@/api/client'
import type { Rezept } from '@/types'

const rezepte = ref<Rezept[]>([])

onMounted(async () => {
  const response = await apiClient.get<Rezept[]>('/api/rezepte')
  rezepte.value = response.data
})
</script>

<template>
  <main>
    <h1>Meine Rezepte</h1>
    <RezeptListe :rezepte="rezepte" />
  </main>
</template>
