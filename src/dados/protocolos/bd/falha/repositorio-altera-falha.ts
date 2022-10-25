import { FalhaAlterada } from '@/dominio/casos-de-uso/falha/altera-falha'

export interface RepositorioAlteraFalha {
  alterar: (dados: FalhaAlterada) => Promise<string>
}
