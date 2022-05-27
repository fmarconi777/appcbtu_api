export interface Encriptador {
  encriptar: (valor: string) => Promise<string >
}
