import { CadastroDeFalha } from '../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { ConsultaFalha } from '../../dominio/casos-de-uso/falha/consulta-falha'
import { ModeloFalha } from '../../dominio/modelos/falha'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ControladorDeFalha } from './falha'

const falhaFalsa = {
  id: '1',
  numFalha: 'numero_qualquer',
  dataCriacao: '2022-01-01T00:00:00Z',
  equipamentoId: '1'
}

const dadoFalso = {
  numFalha: 'numero_qualquer',
  equipamentoId: '1'
}

const makeCadastroDeFalhaStub = (): CadastroDeFalha => {
  class CadastroDeFalhaStub implements CadastroDeFalha {
    async inserir (dados: ModeloFalha): Promise<string> {
      return await new Promise(resolve => resolve('Falha cadastrada com sucesso'))
    }
  }
  return new CadastroDeFalhaStub()
}

const makeConsultaFalhaStub = (): ConsultaFalha => {
  class ConsultaFalhaStub implements ConsultaFalha {
    async consultarTodas (): Promise<ModeloFalha[]> {
      return await Promise.resolve([falhaFalsa])
    }

    async consultar (id: number): Promise<ModeloFalha | null> {
      return await Promise.resolve(falhaFalsa)
    }
  }
  return new ConsultaFalhaStub()
}

interface SubTipos {
  sut: ControladorDeFalha
  cadastroDeFalhaStub: CadastroDeFalha
  consultaFalhaStub: ConsultaFalha
}

const makeSut = (): SubTipos => {
  const consultaFalhaStub = makeConsultaFalhaStub()
  const cadastroDeFalhaStub = makeCadastroDeFalhaStub()
  const sut = new ControladorDeFalha(cadastroDeFalhaStub, consultaFalhaStub)
  return {
    sut,
    cadastroDeFalhaStub,
    consultaFalhaStub
  }
}

describe('ControladorDeFalha', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: dadoFalso,
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método GET', () => {
    test('Deve retornar código 200 e todas as falhas caso um parâmetro não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta([falhaFalsa]))
    })

    test('Deve retornar código 500 caso o método consultarTodas do consultaFalha retorne um erro', async () => {
      const { sut, consultaFalhaStub } = makeSut()
      jest.spyOn(consultaFalhaStub, 'consultarTodas').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar código 404 caso seja fornecido um parâmetro inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })
  })

  describe('Método POST', () => {
    test('Deve retornar codigo 400 caso o parametro numFalha esteja faltando', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          equipamentoId: '1'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('numFalha')))
    })

    test('Deve retornar codigo 400 caso o parametro equipamentoId esteja faltando', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          numFalha: 'numero_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('equipamentoId')))
    })

    test('Deve chamar o cadastroDeFalha com os valores corretos', async () => {
      const { sut, cadastroDeFalhaStub } = makeSut()
      const validarSpy = jest.spyOn(cadastroDeFalhaStub, 'inserir')
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(validarSpy).toHaveBeenCalledWith(dadoFalso)
    })

    test('Deve retornar codigo 500 caso o cadastroDeFalha retorne um erro', async () => {
      const { sut, cadastroDeFalhaStub } = makeSut()
      jest.spyOn(cadastroDeFalhaStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar codigo 404 caso o o cadastroDeFalha retorne null', async () => {
      const { sut, cadastroDeFalhaStub } = makeSut()
      jest.spyOn(cadastroDeFalhaStub, 'inserir').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('equipamentoId')))
    })

    test('Deve retornar codigo 200 em caso de sucesso ao cadastrar uma falha', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: dadoFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta('Falha cadastrada com sucesso'))
    })
  })
})
