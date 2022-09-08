import { RepositorioAlteraAlertaAtivo } from '../bd/alerta/repositorio-altera-alerta-ativo'

export interface AuxiliarAlerta {
  compararDatas: (data: string) => boolean

  filtrarAlertas: (vetor: any[], repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo) => Promise<any[]>
}
