import { MiddlewareDeAutenticacao } from './middleware-de-autenticacao'
import { requisicaoNegada } from '../auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '../erros/erro-acesso-negado'

interface SubTipos {
  sut: MiddlewareDeAutenticacao
}

const makeSut = (): SubTipos => {
  const sut = new MiddlewareDeAutenticacao()
  return {
    sut
  }
}

describe('Middleware de autenticação', () => {
  test('Deve retornar status 403 se não existir o x-access-token no cabeçalho', async () => {
    const { sut } = makeSut()
    const respostaHttp = await sut.tratar({})
    expect(respostaHttp).toEqual(requisicaoNegada(new ErroAcessoNegado()))
  })
})
