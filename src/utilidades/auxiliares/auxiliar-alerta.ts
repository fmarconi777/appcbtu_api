import { ComparadorDeDatas } from '../../dados/protocolos/utilidades/comparador-de-datas'

export class AuxiliarAlerta implements ComparadorDeDatas {
  compararDatas (data: string): boolean {
    const dataAtual = (new Date(Date.now() - 10800000).toISOString()).substring(0, 10)
    const dataAlerta = (new Date(data).toISOString()).substring(0, 10)
    return new Date(dataAlerta).getTime() < new Date(dataAtual).getTime()
  }
}
