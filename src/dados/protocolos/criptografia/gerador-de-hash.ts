export interface GeradorDeHash {
  gerar: (value: string) => Promise<string>
}
