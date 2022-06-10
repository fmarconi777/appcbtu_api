export interface Decriptador {
  decriptar: (valor: string) => Promise<any | null>
}
