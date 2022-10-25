export interface RespostaHttp {
  status: number
  corpo: any
}

export interface RequisicaoHttp {
  corpo?: any
  parametro?: any
  parametro2?: any
  metodo?: any
  cabecalho?: any
}
