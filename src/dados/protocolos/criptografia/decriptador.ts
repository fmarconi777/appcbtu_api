export interface Decriptador {
  decriptar: (valor: string) => Promise<string | null>
}
