<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import EintragBearbeiten from '@/components/EintragBearbeiten.vue'
import WischZeile from '@/components/WischZeile.vue'
import type { Einkaufslisteneintrag } from '@/types'

defineProps<{
  eintrag: Einkaufslisteneintrag
}>()

const emit = defineEmits<{
  abhaken: []
  loeschen: []
  gespeichert: [eintrag: Einkaufslisteneintrag]
}>()

const bearbeitet = ref(false)

function gespeichert(eintrag: Einkaufslisteneintrag) {
  bearbeitet.value = false
  emit('gespeichert', eintrag)
}
</script>

<template>
  <EintragBearbeiten
    v-if="bearbeitet"
    :eintrag="eintrag"
    class="bearbeiten"
    @gespeichert="gespeichert"
    @abgebrochen="bearbeitet = false"
    @loeschen="emit('loeschen')"
  />
  <WischZeile v-else @gewischt="emit('loeschen')">
    <div class="zeile" :class="{ erledigt: eintrag.erledigt }">
      <Checkbox
        :model-value="eintrag.erledigt"
        binary
        :aria-label="`${eintrag.name} erledigt`"
        class="abhaken"
        @update:model-value="emit('abhaken')"
      />
      <span class="stueckzahl">{{ eintrag.stueckzahl }}×</span>
      <button type="button" class="beschreibung" @click="bearbeitet = true">
        <span class="name">{{ eintrag.name }}</span>
        <span v-if="eintrag.rezeptmenge" class="rezeptmenge">{{ eintrag.rezeptmenge }}</span>
      </button>
      <Button
        icon="pi pi-trash"
        severity="secondary"
        variant="text"
        rounded
        class="loeschen-knopf"
        :aria-label="`${eintrag.name} löschen`"
        @click="emit('loeschen')"
      />
    </div>
  </WischZeile>
</template>

<style scoped>
.bearbeiten {
  flex: 1;
}

.zeile {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 4.5rem;
  padding: 0.75rem 0;
}

.abhaken :deep(.p-checkbox-box) {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.abhaken {
  width: 1.5rem;
  height: 1.5rem;
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
  align-items: flex-start;
  min-width: 0;
  padding: 0.25rem 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.beschreibung:hover .name {
  text-decoration: underline;
  text-decoration-color: var(--kobalt);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.rezeptmenge {
  color: var(--zinn);
  font-size: 0.9375rem;
}

/* Auf Touch-Geraeten wird gewischt, der Knopf erscheint nur mit Maus */
.loeschen-knopf {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .loeschen-knopf {
    display: inline-flex;
  }
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
</style>
