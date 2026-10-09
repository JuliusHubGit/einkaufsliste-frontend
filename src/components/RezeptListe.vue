<script setup lang="ts">
import type { Rezept } from '@/types'

defineProps<{
  rezepte: Rezept[]
}>()
</script>

<template>
  <ul v-if="rezepte.length > 0">
    <li v-for="rezept in rezepte" :key="rezept.id">
      {{ rezept.titel }} ({{ rezept.portionen }} Portionen)
    </li>
  </ul>
  <p v-else>Keine Rezepte vorhanden.</p>
</template>
