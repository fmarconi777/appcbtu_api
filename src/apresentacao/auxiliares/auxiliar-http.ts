import { ErroDeServidor } from '../erros/erro-de-servidor'
import { RespostaHttp } from '../protocolos/http'

/*
Este conjunto de funções prepara os dados que devem ser retornados no endpoint
quer sejam dados válidos ou erros.
*/

export const resposta = (dados: any): RespostaHttp => ({
  status: 200,
  corpo: dados
})

export const requisicaoImpropria = (erro: Error): RespostaHttp => ({
  status: 400,
  corpo: erro
})

export const erroDeServidor = (): RespostaHttp => ({
  status: 500,
  corpo: new ErroDeServidor()
})
