<script setup lang="ts">
import RezeptListe from '@/components/RezeptListe.vue'
import type { Rezept } from '@/types'

const beispielRezepte: Rezept[] = [
  { id: 1, titel: 'Spaghetti Carbonara', portionen: 2, besitzer: 'demo' },
  { id: 2, titel: 'Linsensuppe', portionen: 4, besitzer: 'demo' },
  { id: 3, titel: 'Falafel-Wrap', portionen: 3, besitzer: 'demo' },
]
</script>

<template>
  <main>
    <h1>Meine Rezepte</h1>
    <RezeptListe :rezepte="beispielRezepte" />
  </main>
</template>
