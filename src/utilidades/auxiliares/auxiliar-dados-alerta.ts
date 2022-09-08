import { RepositorioAlteraAlertaAtivo } from '../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { AuxiliarAlerta } from '../../dados/protocolos/utilidades/auxiliar-alerta'

export class AuxiliarDadosAlerta implements AuxiliarAlerta {
  compararDatas (data: string): boolean {
    const dataAtual = (new Date(Date.now() - 10800000).toISOString()).substring(0, 10)
    const dataAlerta = (new Date(data).toISOString()).substring(0, 10)
    return new Date(dataAlerta).getTime() < new Date(dataAtual).getTime()
  }

  async filtrarAlertas (vetor: any[], repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo): Promise<any[]> {
    const alertasAtivos: any[] = []
    for (const alerta of vetor) {
      this.compararDatas(alerta.dataFim) ? await repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id) : alertasAtivos.push(alerta)
    }
    return alertasAtivos
  }
}
