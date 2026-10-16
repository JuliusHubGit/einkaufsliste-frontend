<script setup lang="ts">
import type { Rezept } from '@/types'
import Card from 'primevue/card'

defineProps<{
  rezept: Rezept
}>()
</script>

<template>
  <Card>
    <template #title>{{ rezept.titel }}</template>
    <template #subtitle>{{ rezept.portionen }} Portionen</template>
  </Card>
</template>
