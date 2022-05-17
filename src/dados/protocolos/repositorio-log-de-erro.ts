export interface RepositorioLogdeErro {
  log: (stack: string) => Promise<void>
}
