<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import Message from 'primevue/message'
import EintragZeile from '@/components/EintragZeile.vue'
import type { Einkaufslisteneintrag } from '@/types'

const props = defineProps<{
  eintraege: Einkaufslisteneintrag[]
}>()

const emit = defineEmits<{
  umsortiert: [ids: number[]]
  abhaken: [eintrag: Einkaufslisteneintrag]
  loeschen: [id: number]
  gespeichert: [eintrag: Einkaufslisteneintrag]
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
      ghost-class="geist"
      @end="nachVerschieben"
    >
      <template #item="{ element }">
        <li class="eintrag">
          <EintragZeile
            :eintrag="element"
            @abhaken="emit('abhaken', element)"
            @loeschen="emit('loeschen', element.id)"
            @gespeichert="emit('gespeichert', $event)"
          />
          <button type="button" class="drag-griff" :aria-label="`${element.name} verschieben`">
            <i class="pi pi-bars" aria-hidden="true" />
          </button>
        </li>
      </template>
    </draggable>

    <section v-if="erledigte.length > 0" class="erledigt-bereich" aria-labelledby="erledigt-titel">
      <h2 id="erledigt-titel">Erledigt</h2>
      <ul class="eintraege">
        <li v-for="eintrag in erledigte" :key="eintrag.id" class="eintrag erledigt">
          <EintragZeile
            :eintrag="eintrag"
            @abhaken="emit('abhaken', eintrag)"
            @loeschen="emit('loeschen', eintrag.id)"
            @gespeichert="emit('gespeichert', $event)"
          />
          <span class="griff-platz" aria-hidden="true" />
        </li>
      </ul>
    </section>
  </template>
</template>

<style scoped>
.eintraege {
  list-style: none;
  padding: 0;
  border-top: 1px solid var(--linie);
}

.eintrag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-bottom: 1px solid var(--linie);
  background: var(--emaille);
}

.drag-griff,
.griff-platz {
  flex: none;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: var(--rundung);
  background: none;
  color: var(--zinn);
  cursor: grab;
  touch-action: none;
}

/* Beim Bearbeiten braucht das Formular die ganze Breite */
.eintrag:has(.bearbeiten) .drag-griff,
.eintrag:has(.bearbeiten) .griff-platz {
  display: none;
}

.drag-griff:hover {
  color: var(--tinte);
}

.geist {
  opacity: 0.4;
}

.erledigt-bereich {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.erledigt-bereich h2 {
  color: var(--zinn);
}
</style>
