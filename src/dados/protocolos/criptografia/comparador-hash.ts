export interface ComparadorHash {
  comparar: (senha: string, hash: string) => Promise<boolean>
}
