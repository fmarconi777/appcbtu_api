import { MiddlewareDeAutenticacao } from './middleware-de-autenticacao'
import { erroDeServidor, requisicaoNegada, resposta } from '../auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '../erros/erro-acesso-negado'
import { ConsultaFuncionarioPeloToken } from '../../dominio/casos-de-uso/middleware/consulta-funcionario-por-token'
import { ModeloFuncionario } from '../../dominio/modelos/funcionario'
import { RequisicaoHttp } from '../protocolos/http'

const makeContaFalsa = (): ModeloFuncionario => ({
  id: 'id_valido',
  nome: 'nome_valido',
  email: 'email_valido',
  senha: 'hash_senha',
  administrador: 'false',
  areaId: 'area_valida'
})

const makeRequisicaoFalsa = (): RequisicaoHttp => ({
  cabecalho: { 'x-access-token': 'token_qualquer' }
})

const makeConsultaFuncionarioPeloToken = (): ConsultaFuncionarioPeloToken => {
  class ConsultaFuncionarioPeloToken implements ConsultaFuncionarioPeloToken {
    async consultar (tokenDeAcesso: string, nivel?: string): Promise<ModeloFuncionario | null> {
      return await new Promise(resolve => resolve(makeContaFalsa()))
    }
  }
  return new ConsultaFuncionarioPeloToken()
}

interface SubTipos {
  sut: MiddlewareDeAutenticacao
  consultaFuncionarioPeloToken: ConsultaFuncionarioPeloToken
}

const makeSut = (nivel?: string): SubTipos => {
  const consultaFuncionarioPeloToken = makeConsultaFuncionarioPeloToken()
  const sut = new MiddlewareDeAutenticacao(consultaFuncionarioPeloToken, nivel)
  return {
    sut,
    consultaFuncionarioPeloToken
  }
}

describe('Middleware de autenticação', () => {
  test('Deve retornar status 403 se não existir o x-access-token no cabeçalho', async () => {
    const { sut } = makeSut()
    const respostaHttp = await sut.tratar({})
    expect(respostaHttp).toEqual(requisicaoNegada(new ErroAcessoNegado()))
  })

  test('Deve chamar o ConsultaFuncionarioPeloToken com o tokenDeAcesso correto', async () => {
    const nivel = 'nivel_qualquer'
    const { sut, consultaFuncionarioPeloToken } = makeSut(nivel)
    const consultaSpy = jest.spyOn(consultaFuncionarioPeloToken, 'consultar')
    await sut.tratar(makeRequisicaoFalsa())
    expect(consultaSpy).toHaveBeenCalledWith('token_qualquer', nivel)
  })

  test('Deve retornar status 403 se ConsultaFuncionarioPeloToken retornar null', async () => {
    const { sut, consultaFuncionarioPeloToken } = makeSut()
    jest.spyOn(consultaFuncionarioPeloToken, 'consultar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const respostaHttp = await sut.tratar(makeRequisicaoFalsa())
    expect(respostaHttp).toEqual(requisicaoNegada(new ErroAcessoNegado()))
  })

  test('Deve retornar status 200 se ConsultaFuncionarioPeloToken retornar uma conta', async () => {
    const { sut } = makeSut()
    const respostaHttp = await sut.tratar(makeRequisicaoFalsa())
    expect(respostaHttp).toEqual(resposta({ IdFuncionario: 'id_valido' }))
  })

  test('Deve retornar status 500 se ConsultaFuncionarioPeloToken retornar um erro', async () => {
    const { sut, consultaFuncionarioPeloToken } = makeSut()
    jest.spyOn(consultaFuncionarioPeloToken, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const respostaHttp = await sut.tratar(makeRequisicaoFalsa())
    expect(respostaHttp).toEqual(erroDeServidor(new Error()))
  })
})
