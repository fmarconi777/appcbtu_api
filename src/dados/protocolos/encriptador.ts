export interface Encriptador {
  encriptar: (value: string) => Promise<string>
}
