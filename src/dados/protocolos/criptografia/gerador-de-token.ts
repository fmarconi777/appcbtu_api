export interface GeradorDeToken {
  gerar: (id: string) => Promise<string >
}
