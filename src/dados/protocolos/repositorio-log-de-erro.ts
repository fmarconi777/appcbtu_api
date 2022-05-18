export interface RepositorioLogDeErro {
  logErro: (stack: string) => Promise<void>
}
