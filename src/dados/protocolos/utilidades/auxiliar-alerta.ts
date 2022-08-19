export interface AuxiliarAlerta {
  compararDatas: (data: string) => boolean

  asyncFilter: (vetor: any[], condicional: CallableFunction) => Promise<any[]>

  condicional: (alerta: { dataFim: string, id: string }) => Promise<boolean>
}
