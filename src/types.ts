export type Schwierigkeit = 'EINFACH' | 'NORMAL' | 'AUFWAENDIG'

export const schwierigkeitBezeichnung: Record<Schwierigkeit, string> = {
  EINFACH: 'Einfach',
  NORMAL: 'Normal',
  AUFWAENDIG: 'Aufwändig',
}

export interface Zutat {
  id: number
  name: string
  menge: number
  einheit: string
}

export interface Rezept {
  id: number
  titel: string
  portionen: number
  schwierigkeit: Schwierigkeit
  zutaten: Zutat[]
  besitzer: string
}

export interface NeuesRezept {
  titel: string
  portionen: number
  schwierigkeit: Schwierigkeit
  zutaten: { name: string; menge: number; einheit: string }[]
}

/** Feldfehler beim Anlegen eines Rezepts; Zutaten-Fehler heissen z. B. 'zutaten[0].menge' */
export type RezeptFeldfehler = Record<string, string>

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
