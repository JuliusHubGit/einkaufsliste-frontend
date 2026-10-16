<script setup lang="ts">
import type { Rezept } from '@/types'

defineProps<{
  rezept: Rezept
}>()
</script>

<template>
  <header class="rezept-kopf">
    <h1>{{ rezept.titel }}</h1>
    <p class="portionen">{{ rezept.portionen }} Portionen</p>
  </header>
</template>

<style scoped>
.rezept-kopf {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.portionen {
  color: var(--zinn);
  font-size: 1.125rem;
}
</style>
