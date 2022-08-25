import { RepositorioAlteraAlertaAtivo } from '../../dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { AuxiliarAlerta } from '../../dados/protocolos/utilidades/auxiliar-alerta'

export class AuxiliarDadosAlerta implements AuxiliarAlerta {
  constructor (private readonly repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo) {}

  compararDatas (data: string): boolean {
    const dataAtual = (new Date(Date.now() - 10800000).toISOString()).substring(0, 10)
    const dataAlerta = (new Date(data).toISOString()).substring(0, 10)
    return new Date(dataAlerta).getTime() < new Date(dataAtual).getTime()
  }

  // Pode não ser a forma mais elegante de resolver o problema de bind de métodos de classe à instância de objetos,
  // mas é a forma mais simples diante das opções.
  // Pode ser usado a biblioteca auto-bind para retirar a redundância de código,
  // porém a classe passa a funcionar como um objeto e é preciso garantir que
  // o autoBind será chamado toda vez que o método compararDatas for atribuido ao
  // objeto. Podemos usar também o padrão de projeto Proxy, mas não é produtivo fazê-lo
  // para apenas esta função que será usada apenas aqui.
  static compararDatas (data: string): boolean {
    const dataAtual = (new Date(Date.now() - 10800000).toISOString()).substring(0, 10)
    const dataAlerta = (new Date(data).toISOString()).substring(0, 10)
    return new Date(dataAlerta).getTime() < new Date(dataAtual).getTime()
  }

  async asyncFilter (vetor: any[], condicional: CallableFunction): Promise<any[]> {
    return vetor.reduce(async (acumulador, elemento) => await condicional(elemento) ? [...await acumulador, elemento] : acumulador, []) //eslint-disable-line
  }

  async condicional (alerta: { dataFim: string, id: string }, compararDatas = AuxiliarDadosAlerta.compararDatas): Promise<boolean> {
    const dataFimMenor = compararDatas(alerta.dataFim)
    if (dataFimMenor) { //eslint-disable-line
      await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, +alerta.id)
      return !dataFimMenor //eslint-disable-line
    }
    return !dataFimMenor //eslint-disable-line
  }
}
