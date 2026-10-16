<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="hauptnav" aria-label="Hauptnavigation">
    <RouterLink to="/" class="tab" :class="{ aktiv: $route.name !== 'einkaufsliste' }">
      <i class="pi pi-book" aria-hidden="true" />
      Rezepte
    </RouterLink>
    <RouterLink to="/einkaufsliste" class="tab" active-class="aktiv">
      <i class="pi pi-shopping-cart" aria-hidden="true" />
      Einkaufsliste
    </RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
/* Smartphone: Leiste unten, in Daumenreichweite */
.hauptnav {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 10;
  display: flex;
  height: calc(var(--nav-hoehe) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--flaeche);
  border-top: 1px solid var(--linie);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  font-size: 0.875rem;
  text-decoration: none;
  color: var(--zinn);
  border-top: var(--rand) solid transparent;
}

.tab .pi {
  font-size: 1.25rem;
}

.tab.aktiv {
  color: var(--kobalt);
  border-top-color: var(--kobalt);
  font-weight: 700;
}

/* Desktop: Leiste oben */
@media (min-width: 768px) {
  .hauptnav {
    position: static;
    height: auto;
    padding: 0;
    gap: 2rem;
    margin-bottom: 2.5rem;
    background: none;
    border-top: 0;
    border-bottom: 1px solid var(--linie);
  }

  .tab {
    flex: none;
    flex-direction: row;
    gap: 0.5rem;
    padding: 1.25rem 0 1rem;
    font-size: 1rem;
    border-top: 0;
    border-bottom: var(--rand) solid transparent;
    margin-bottom: -1px;
  }

  .tab.aktiv {
    border-bottom-color: var(--kobalt);
  }

  .tab .pi {
    font-size: 1rem;
  }
}
</style>
