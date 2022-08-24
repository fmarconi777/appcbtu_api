import { RepositorioAlteraAlertaAtivo } from '../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'

export class AuxiliarAlerta implements AuxiliarAlerta {
  constructor (private readonly repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo) {}

  compararDatas (data: string): boolean {
    const dataAtual = (new Date(Date.now() - 10800000).toISOString()).substring(0, 10)
    const dataAlerta = (new Date(data).toISOString()).substring(0, 10)
    return new Date(dataAlerta).getTime() < new Date(dataAtual).getTime()
  }

  async asyncFilter (vetor: any[], condicional: CallableFunction): Promise<any[]> {
    return vetor.reduce(async (acumulador, elemento) => await condicional(elemento) ? [...await acumulador, elemento] : acumulador, []) //eslint-disable-line
  }

  async condicional (alerta: { dataFim: string, id: string }): Promise<boolean> {
    const dataFimMenor = this.compararDatas(alerta.dataFim)
    if (dataFimMenor) {
      await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
      return !dataFimMenor
    }
    return !dataFimMenor
  }
}
