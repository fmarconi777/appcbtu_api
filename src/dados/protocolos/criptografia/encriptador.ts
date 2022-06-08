export interface Encriptador {
  encriptar: (token: string) => Promise<string >
}
