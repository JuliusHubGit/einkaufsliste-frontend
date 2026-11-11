<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'
import RezeptFormular from '@/components/RezeptFormular.vue'
import { apiClient } from '@/api/client'
import type { Rezept } from '@/types'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const rezepte = ref<Rezept[]>([])
const laedt = ref(true)
const fehler = ref(false)
const loeschFehler = ref(false)
const formularOffen = ref(false)

onMounted(async () => {
  try {
    const response = await apiClient.get<Rezept[]>('/api/rezepte')
    rezepte.value = response.data
  } catch {
    fehler.value = true
  } finally {
    laedt.value = false
  }
})

function rezeptAngelegt(rezept: Rezept) {
  rezepte.value = [...rezepte.value, rezept]
  formularOffen.value = false
}

async function loeschen(id: number) {
  loeschFehler.value = false
  try {
    await apiClient.delete(`/api/rezepte/${id}`)
    rezepte.value = rezepte.value.filter((rezept) => rezept.id !== id)
  } catch {
    loeschFehler.value = true
  }
}
</script>

<template>
  <main class="seite">
    <div class="kopf">
      <h1>Rezepte</h1>
      <Button
        v-if="!formularOffen"
        label="Neues Rezept"
        icon="pi pi-plus"
        @click="formularOffen = true"
      />
    </div>
    <RezeptFormular
      v-if="formularOffen"
      @angelegt="rezeptAngelegt"
      @abgebrochen="formularOffen = false"
    />
    <ProgressSpinner v-if="laedt" />
    <Message v-else-if="fehler" severity="error">
      Die Rezepte konnten nicht geladen werden.
    </Message>
    <template v-else>
      <Message v-if="loeschFehler" severity="error">
        Das Rezept konnte nicht gelöscht werden.
      </Message>
      <RezeptListe :rezepte="rezepte" @loeschen="loeschen" />
    </template>
  </main>
</template>

<style scoped>
.seite {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kopf {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
