<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import Message from 'primevue/message'
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
      ghost-class="geist"
      @end="nachVerschieben"
    >
      <template #item="{ element }">
        <li class="eintrag">
          <span class="stueckzahl">{{ element.stueckzahl }}×</span>
          <span class="beschreibung">
            <span class="name">{{ element.name }}</span>
            <span v-if="element.rezeptmenge" class="rezeptmenge">{{ element.rezeptmenge }}</span>
          </span>
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
          <span class="stueckzahl">{{ eintrag.stueckzahl }}×</span>
          <span class="beschreibung">
            <span class="name">{{ eintrag.name }}</span>
            <span v-if="eintrag.rezeptmenge" class="rezeptmenge">{{ eintrag.rezeptmenge }}</span>
          </span>
          <i class="pi pi-check haken" aria-label="erledigt" />
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
  gap: 1rem;
  min-height: 4.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--linie);
  background: var(--emaille);
}

/* Die Emaille-Marke: Stueckzahl gross, in Senf mit Kobalt-Rand */
.stueckzahl {
  flex: none;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--senf);
  color: var(--senf-tinte);
  border: var(--rand) solid var(--kobalt);
  box-shadow: inset 0 -3px 0 rgb(0 0 0 / 0.12);
  font-size: 1.125rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
}

.beschreibung {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.rezeptmenge {
  color: var(--zinn);
  font-size: 0.9375rem;
}

.drag-griff {
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

.erledigt .stueckzahl {
  background: transparent;
  color: var(--zinn);
  border-color: var(--linie);
  box-shadow: none;
}

.erledigt .name {
  font-weight: 400;
  color: var(--zinn);
  text-decoration: line-through;
  text-decoration-color: var(--kraeuter);
  text-decoration-thickness: 2px;
}

.haken {
  flex: none;
  width: 3rem;
  text-align: center;
  color: var(--kraeuter);
  font-size: 1.25rem;
}
</style>
