export interface Rezept {
  id: number
  titel: string
  portionen: number
  besitzer: string
}

export interface Einkaufslisteneintrag {
  id: number
  name: string
  stueckzahl: number
  rezeptmenge: string | null
  reihenfolge: number
  erledigt: boolean
  besitzer: string
}

export interface NeuerEintrag {
  name: string
  stueckzahl: number
}

/** Feldfehler aus einer 400-Antwort des Backends, z. B. { name: 'Bitte einen Namen eingeben' } */
export type Feldfehler = Partial<Record<keyof EintragAenderung, string>>

export interface EintragAenderung {
  name: string
  stueckzahl: number
  erledigt: boolean
}
