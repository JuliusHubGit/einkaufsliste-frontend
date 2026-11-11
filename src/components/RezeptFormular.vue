<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import SelectButton from 'primevue/selectbutton'
import { apiClient } from '@/api/client'
import {
  schwierigkeitBezeichnung,
  type NeuesRezept,
  type Rezept,
  type RezeptFeldfehler,
  type Schwierigkeit,
} from '@/types'

interface ZutatZeile {
  schluessel: number
  name: string
  menge: number | null
  einheit: string
}

const emit = defineEmits<{
  angelegt: [rezept: Rezept]
  abgebrochen: []
}>()

const schwierigkeiten = (Object.keys(schwierigkeitBezeichnung) as Schwierigkeit[]).map((wert) => ({
  wert,
  bezeichnung: schwierigkeitBezeichnung[wert],
}))

const titel = ref('')
const portionen = ref<number | null>(2)
const schwierigkeit = ref<Schwierigkeit>('NORMAL')
const zutaten = ref<ZutatZeile[]>([])
const feldfehler = ref<RezeptFeldfehler>({})
const fehler = ref(false)
const sendet = ref(false)
let naechsterSchluessel = 0

function zutatHinzufuegen() {
  zutaten.value.push({ schluessel: naechsterSchluessel++, name: '', menge: null, einheit: '' })
}

function zutatEntfernen(index: number) {
  zutaten.value.splice(index, 1)
  // Feldfehler haengen am Index und passen nach dem Entfernen nicht mehr
  feldfehler.value = {}
}

async function speichern() {
  feldfehler.value = {}
  fehler.value = false
  sendet.value = true
  const neuesRezept: NeuesRezept = {
    titel: titel.value,
    portionen: portionen.value ?? 0,
    schwierigkeit: schwierigkeit.value,
    zutaten: zutaten.value.map((zutat) => ({
      name: zutat.name,
      menge: zutat.menge ?? 0,
      einheit: zutat.einheit,
    })),
  }
  try {
    const response = await apiClient.post<Rezept>('/api/rezepte', neuesRezept)
    emit('angelegt', response.data)
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 400 && e.response.data?.feldfehler) {
      feldfehler.value = e.response.data.feldfehler
    } else {
      fehler.value = true
    }
  } finally {
    sendet.value = false
  }
}
</script>

<template>
  <form class="formular" novalidate @submit.prevent="speichern">
    <h2>Neues Rezept</h2>

    <div class="feld">
      <label for="rezept-titel">Titel</label>
      <InputText id="rezept-titel" v-model="titel" :invalid="!!feldfehler.titel" fluid />
      <Message v-if="feldfehler.titel" severity="error" size="small" variant="simple">
        {{ feldfehler.titel }}
      </Message>
    </div>

    <div class="zeile">
      <div class="feld feld-portionen">
        <label for="rezept-portionen">Portionen</label>
        <InputNumber
          v-model="portionen"
          input-id="rezept-portionen"
          :invalid="!!feldfehler.portionen"
          show-buttons
          button-layout="horizontal"
          fluid
        >
          <template #incrementbuttonicon><i class="pi pi-plus" aria-hidden="true" /></template>
          <template #decrementbuttonicon><i class="pi pi-minus" aria-hidden="true" /></template>
        </InputNumber>
        <Message v-if="feldfehler.portionen" severity="error" size="small" variant="simple">
          {{ feldfehler.portionen }}
        </Message>
      </div>

      <div class="feld">
        <span id="rezept-schwierigkeit" class="beschriftung">Schwierigkeit</span>
        <SelectButton
          v-model="schwierigkeit"
          :options="schwierigkeiten"
          option-label="bezeichnung"
          option-value="wert"
          :allow-empty="false"
          :invalid="!!feldfehler.schwierigkeit"
          aria-labelledby="rezept-schwierigkeit"
        />
        <Message v-if="feldfehler.schwierigkeit" severity="error" size="small" variant="simple">
          {{ feldfehler.schwierigkeit }}
        </Message>
      </div>
    </div>

    <fieldset class="zutaten">
      <legend>Zutaten</legend>
      <div v-for="(zutat, index) in zutaten" :key="zutat.schluessel" class="zutat">
        <div class="feld zutat-name">
          <label :for="`zutat-${zutat.schluessel}-name`" class="unsichtbar"
            >Zutat {{ index + 1 }}</label
          >
          <InputText
            :id="`zutat-${zutat.schluessel}-name`"
            v-model="zutat.name"
            placeholder="Zutat"
            :invalid="!!feldfehler[`zutaten[${index}].name`]"
            fluid
          />
          <Message
            v-if="feldfehler[`zutaten[${index}].name`]"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ feldfehler[`zutaten[${index}].name`] }}
          </Message>
        </div>
        <div class="feld zutat-menge">
          <label :for="`zutat-${zutat.schluessel}-menge`" class="unsichtbar"
            >Menge von Zutat {{ index + 1 }}</label
          >
          <InputNumber
            v-model="zutat.menge"
            :input-id="`zutat-${zutat.schluessel}-menge`"
            placeholder="Menge"
            locale="de-DE"
            :max-fraction-digits="2"
            :invalid="!!feldfehler[`zutaten[${index}].menge`]"
            fluid
          />
          <Message
            v-if="feldfehler[`zutaten[${index}].menge`]"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ feldfehler[`zutaten[${index}].menge`] }}
          </Message>
        </div>
        <div class="feld zutat-einheit">
          <label :for="`zutat-${zutat.schluessel}-einheit`" class="unsichtbar"
            >Einheit von Zutat {{ index + 1 }}</label
          >
          <InputText
            :id="`zutat-${zutat.schluessel}-einheit`"
            v-model="zutat.einheit"
            placeholder="Einheit"
            :invalid="!!feldfehler[`zutaten[${index}].einheit`]"
            fluid
          />
          <Message
            v-if="feldfehler[`zutaten[${index}].einheit`]"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ feldfehler[`zutaten[${index}].einheit`] }}
          </Message>
        </div>
        <Button
          icon="pi pi-trash"
          severity="secondary"
          variant="text"
          rounded
          class="zutat-entfernen"
          :aria-label="`Zutat ${index + 1} entfernen`"
          @click="zutatEntfernen(index)"
        />
      </div>
      <Button
        label="Zutat hinzufügen"
        icon="pi pi-plus"
        severity="secondary"
        variant="outlined"
        class="zutat-hinzufuegen"
        @click="zutatHinzufuegen"
      />
    </fieldset>

    <Message v-if="fehler" severity="error">
      Das Rezept wurde nicht gespeichert. Prüfe die Verbindung und versuche es noch einmal.
    </Message>

    <div class="aktionen">
      <Button type="submit" label="Rezept speichern" icon="pi pi-check" :loading="sendet" />
      <Button label="Abbrechen" severity="secondary" variant="text" @click="emit('abgebrochen')" />
    </div>
  </form>
</template>

<style scoped>
.formular {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--flaeche);
  border: 1px solid var(--linie);
  border-radius: var(--rundung);
}

.feld {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.feld label,
.beschriftung,
.zutaten legend {
  font-weight: 600;
}

.zeile {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 1.5rem;
}

.feld-portionen {
  width: 9rem;
}

.feld-portionen :deep(.p-inputnumber-input) {
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.zutaten {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 0;
  padding: 0;
  margin: 0;
}

.zutaten legend {
  padding: 0;
  margin-bottom: 0.35rem;
}

/* Smartphone: Name oben, Menge und Einheit darunter */
.zutat {
  display: grid;
  grid-template-columns: 1fr 6rem auto;
  grid-template-areas:
    'name name entfernen'
    'menge einheit .';
  align-items: start;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--linie);
}

.zutat-name {
  grid-area: name;
}

.zutat-menge {
  grid-area: menge;
}

.zutat-einheit {
  grid-area: einheit;
}

.zutat-entfernen {
  grid-area: entfernen;
}

.zutat-hinzufuegen {
  align-self: flex-start;
}

.aktionen {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.unsichtbar {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .zutat {
    grid-template-columns: 1fr 7rem 6rem auto;
    grid-template-areas: 'name menge einheit entfernen';
    padding-bottom: 0;
    border-bottom: 0;
  }
}
</style>
