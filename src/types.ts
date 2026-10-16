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
