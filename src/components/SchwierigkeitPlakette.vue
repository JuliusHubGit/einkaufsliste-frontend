<script setup lang="ts">
import { schwierigkeitBezeichnung, type Schwierigkeit } from '@/types'

defineProps<{
  schwierigkeit: Schwierigkeit
}>()
</script>

<template>
  <span class="plakette">{{ schwierigkeitBezeichnung[schwierigkeit] }}</span>
</template>

<style scoped>
.plakette {
  padding: 0.05rem 0.6rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--kobalt);
  border: 1px solid currentColor;
  border-radius: 999px;
}
</style>
