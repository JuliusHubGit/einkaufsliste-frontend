<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import type { Einkaufslisteneintrag } from '@/types'

const props = defineProps<{
  eintraege: Einkaufslisteneintrag[]
}>()

const emit = defineEmits<{
  umsortiert: [ids: number[]]
}>()

const offene = ref<Einkaufslisteneintrag[]>([])
const erledigte = computed(() => props.eintraege.filter((eintrag) => eintrag.erledigt))

watch(
  () => props.eintraege,
  (eintraege) => {
    offene.value = eintraege.filter((eintrag) => !eintrag.erledigt)
  },
  { immediate: true },
)

function nachVerschieben() {
  emit(
    'umsortiert',
    [...offene.value, ...erledigte.value].map((eintrag) => eintrag.id),
  )
}
</script>

<template>
  <Message v-if="eintraege.length === 0" severity="info">Die Einkaufsliste ist leer.</Message>
  <template v-else>
    <draggable
      v-model="offene"
      item-key="id"
      handle=".drag-griff"
      tag="ul"
      class="eintraege"
      @end="nachVerschieben"
    >
      <template #item="{ element }">
        <li class="eintrag">
          <i class="pi pi-bars drag-griff" aria-label="Verschieben" />
          <span class="name">{{ element.name }}</span>
          <Tag :value="`${element.stueckzahl}×`" severity="secondary" />
          <Tag v-if="element.rezeptmenge" :value="element.rezeptmenge" severity="info" />
        </li>
      </template>
    </draggable>

    <template v-if="erledigte.length > 0">
      <Divider align="left">Erledigt</Divider>
      <ul class="eintraege">
        <li v-for="eintrag in erledigte" :key="eintrag.id" class="eintrag erledigt">
          <i class="pi pi-check" />
          <span class="name">{{ eintrag.name }}</span>
          <Tag :value="`${eintrag.stueckzahl}×`" severity="secondary" />
          <Tag v-if="eintrag.rezeptmenge" :value="eintrag.rezeptmenge" severity="info" />
        </li>
      </ul>
    </template>
  </template>
</template>

<style scoped>
.eintraege {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.eintrag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-content-border-radius);
  background: var(--p-content-background);
}

.name {
  flex: 1;
}

.drag-griff {
  cursor: grab;
  padding: 0.25rem;
  touch-action: none;
}

.erledigt {
  opacity: 0.6;
}

.erledigt .name {
  text-decoration: line-through;
}
</style>
