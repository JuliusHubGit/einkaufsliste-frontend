<script setup lang="ts">
import type { Rezept } from '@/types'
import SchwierigkeitPlakette from '@/components/SchwierigkeitPlakette.vue'

defineProps<{
  rezept: Rezept
}>()

const mengenFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 })
</script>

<template>
  <header class="rezept-kopf">
    <h1>{{ rezept.titel }}</h1>
    <p class="angaben">
      <span class="portionen">{{ rezept.portionen }} Portionen</span>
      <SchwierigkeitPlakette :schwierigkeit="rezept.schwierigkeit" />
    </p>
  </header>

  <div class="inhalt">
    <section aria-labelledby="zutaten-titel">
      <h2 id="zutaten-titel">Zutaten</h2>
      <ul v-if="rezept.zutaten.length > 0" class="zutatenliste">
        <li v-for="zutat in rezept.zutaten" :key="zutat.id" class="zutat">
          <span class="menge">{{ mengenFormat.format(zutat.menge) }} {{ zutat.einheit }}</span>
          <span>{{ zutat.name }}</span>
        </li>
      </ul>
      <p v-else class="leer">Keine Zutaten erfasst.</p>
    </section>

    <section aria-labelledby="schritte-titel">
      <h2 id="schritte-titel">Zubereitung</h2>
      <ol v-if="rezept.schritte.length > 0" class="schrittliste">
        <li v-for="schritt in rezept.schritte" :key="schritt.id" class="schritt">
          <span class="nummer" aria-hidden="true">{{ schritt.position }}</span>
          <div class="schritt-text">
            <p class="beschreibung">{{ schritt.beschreibung }}</p>
            <ul
              v-if="schritt.zutaten.length > 0"
              class="schritt-zutaten"
              :aria-label="`Zutaten für Schritt ${schritt.position}`"
            >
              <li v-for="verweis in schritt.zutaten" :key="verweis.id">
                {{ verweis.zutat.name }}
              </li>
            </ul>
          </div>
        </li>
      </ol>
      <p v-else class="leer">Keine Schritte erfasst.</p>
    </section>
  </div>
</template>

<style scoped>
.rezept-kopf {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.angaben {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.portionen {
  color: var(--zinn);
  font-size: 1.125rem;
}

.inhalt {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.zutatenliste,
.schrittliste {
  list-style: none;
  padding: 0;
  margin: 0;
}

.zutat {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--linie);
}

.menge {
  color: var(--zinn);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.schrittliste {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.schritt {
  display: flex;
  gap: 1rem;
}

.nummer {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  font-family: var(--schrift-titel);
  color: var(--kobalt);
  border: 2px solid currentColor;
  border-radius: 50%;
}

.schritt-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.2rem;
}

.beschreibung {
  margin: 0;
  white-space: pre-line;
}

.schritt-zutaten {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.schritt-zutaten li {
  padding: 0.05rem 0.6rem;
  font-size: 0.875rem;
  color: var(--zinn);
  background: var(--emaille);
  border: 1px solid var(--linie);
  border-radius: 999px;
}

.leer {
  color: var(--zinn);
  margin: 0;
}

@media (min-width: 768px) {
  .inhalt {
    display: grid;
    grid-template-columns: minmax(14rem, 1fr) 2fr;
    align-items: start;
  }
}
</style>
