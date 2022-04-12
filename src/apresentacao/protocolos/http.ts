/*
Este protocolo define o formato como uma requisição preferêncialmente deve ser recebida,
pois o corpo é opcional.
E também define como a resposta http será retornada.
 */

export interface RespostaHttp {
  status: number
  corpo: any
}

export interface RequisicaoHttp {
  corpo?: any
}
