<script setup lang="ts">
import type { Rezept } from '@/types'
import Card from 'primevue/card'
import Message from 'primevue/message'

defineProps<{
  rezepte: Rezept[]
}>()
</script>

<template>
  <div v-if="rezepte.length > 0" class="rezept-grid">
    <Card v-for="rezept in rezepte" :key="rezept.id">
      <template #title>{{ rezept.titel }}</template>
      <template #subtitle>{{ rezept.portionen }} Portionen</template>
    </Card>
  </div>
  <Message v-else severity="info">Keine Rezepte vorhanden.</Message>
</template>

<style scoped>
.rezept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
</style>
