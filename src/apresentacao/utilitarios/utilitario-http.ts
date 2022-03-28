import { RespostaHttp } from '../protocolos/http'

export const resposta = (dados: any): RespostaHttp => ({
  codigoDeStatus: 200,
  corpo: dados
})
