<script setup lang="ts">
import type { Rezept } from '@/types'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Message from 'primevue/message'

defineProps<{
  rezepte: Rezept[]
}>()

const emit = defineEmits<{
  loeschen: [id: number]
}>()
</script>

<template>
  <ul v-if="rezepte.length > 0" class="register">
    <li v-for="rezept in rezepte" :key="rezept.id" class="register-zeile">
      <RouterLink :to="{ name: 'rezept-detail', params: { id: rezept.id } }" class="rezept-link">
        <span class="titel">{{ rezept.titel }}</span>
        <span class="portionen">{{ rezept.portionen }} Portionen</span>
      </RouterLink>
      <Button
        icon="pi pi-trash"
        severity="secondary"
        variant="text"
        rounded
        :aria-label="`${rezept.titel} löschen`"
        @click="emit('loeschen', rezept.id)"
      />
    </li>
  </ul>
  <Message v-else severity="info">Keine Rezepte vorhanden.</Message>
</template>

<style scoped>
.register {
  list-style: none;
  padding: 0;
  border-top: 1px solid var(--linie);
}

.register-zeile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--linie);
}

.rezept-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 1rem 0;
  text-decoration: none;
}

.titel {
  font-family: var(--schrift-titel);
  font-size: 1.375rem;
  line-height: 1.2;
}

.rezept-link:hover .titel {
  text-decoration: underline;
  text-decoration-color: var(--kobalt);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.portionen {
  color: var(--zinn);
}
</style>
