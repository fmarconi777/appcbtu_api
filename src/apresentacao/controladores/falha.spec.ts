import { ControladorDeFalha } from './falha'
import { AlteraFalha, FalhaAlterada, FalhaValida } from '@/dominio/casos-de-uso/falha/altera-falha'
import { CadastroDeFalha, DadosFalha } from '@/dominio/casos-de-uso/falha/cadastro-de-falha'
import { ConsultaFalha } from '@/dominio/casos-de-uso/falha/consulta-falha'
import { ModeloFalha } from '@/dominio/modelos/falha'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'

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
    async inserir (dados: DadosFalha): Promise<string> {
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

const makeAlteraFalhaStub = (): AlteraFalha => {
  class AlteraFalhaStub implements AlteraFalha {
    async alterar (dados: FalhaAlterada): Promise<FalhaValida> {
      return {
        falhaInvalida: false,
        parametro: 'Falha alterada com sucesso'
      }
    }
  }
  return new AlteraFalhaStub()
}

interface SubTipos {
  sut: ControladorDeFalha
  cadastroDeFalhaStub: CadastroDeFalha
  consultaFalhaStub: ConsultaFalha
  alteraFalhaStub: AlteraFalha
}

const makeSut = (): SubTipos => {
  const alteraFalhaStub = makeAlteraFalhaStub()
  const consultaFalhaStub = makeConsultaFalhaStub()
  const cadastroDeFalhaStub = makeCadastroDeFalhaStub()
  const sut = new ControladorDeFalha(cadastroDeFalhaStub, consultaFalhaStub, alteraFalhaStub)
  return {
    sut,
    cadastroDeFalhaStub,
    consultaFalhaStub,
    alteraFalhaStub
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

    test('Deve chamar o método consultar do consultaFalha com o valor correto', async () => {
      const { sut, consultaFalhaStub } = makeSut()
      const consultarSpy = jest.spyOn(consultaFalhaStub, 'consultar')
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      await sut.tratar(requisicaoHttp)
      expect(consultarSpy).toHaveBeenCalledWith(1)
    })

    test('Deve retornar código 500 caso o método consultar do consultaFalha retorne um erro', async () => {
      const { sut, consultaFalhaStub } = makeSut()
      jest.spyOn(consultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar código 404 caso o método consultar retorne null', async () => {
      const { sut, consultaFalhaStub } = makeSut()
      jest.spyOn(consultaFalhaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar código 200 e uma falha caso um parâmetro válido seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta(falhaFalsa))
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
      const data = new Date(Date.now() - 10800000).toISOString()
      const dataCriacao = (data.substring(0, 19) + 'Z')
      const dados = Object.assign({}, dadoFalso, { dataCriacao })
      await sut.tratar(requisicaoHttp)
      expect(validarSpy).toHaveBeenCalledWith(dados)
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

  describe('Método PATCH', () => {
    test('Deve retornar código 400 caso o parametro numFalha esteja faltando', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('numFalha')))
    })

    test('Deve retornar código 400 caso o parametro equipamentoId esteja faltando', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: 'numero_qualquer'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoImpropria(new ErroFaltaParametro('equipamentoId')))
    })

    test('Deve retornar código 404 caso seja fornecido um parâmetro inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        corpo: dadoFalso,
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve chamar o método alterar do alteraFalha com os valores corretos', async () => {
      const { sut, alteraFalhaStub } = makeSut()
      const alterarSpy = jest.spyOn(alteraFalhaStub, 'alterar')
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: '0',
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      await sut.tratar(requisicaoHttp)
      expect(alterarSpy).toHaveBeenCalledWith({
        id: 1,
        numFalha: 0,
        equipamentoId: 1
      })
    })

    test('Deve retornar código 500 caso o alteraFalha retorne um erro', async () => {
      const { sut, alteraFalhaStub } = makeSut()
      jest.spyOn(alteraFalhaStub, 'alterar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: '0',
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar código 404 caso o alteraFalha retorne falhaInvalida = true e parametro = id', async () => {
      const { sut, alteraFalhaStub } = makeSut()
      jest.spyOn(alteraFalhaStub, 'alterar').mockReturnValueOnce(Promise.resolve({ falhaInvalida: true, parametro: 'id' }))
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: '0',
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar código 404 caso o alteraFalha retorne falhaInvalida = true e parametro = equipamentoId', async () => {
      const { sut, alteraFalhaStub } = makeSut()
      jest.spyOn(alteraFalhaStub, 'alterar').mockReturnValueOnce(Promise.resolve({ falhaInvalida: true, parametro: 'equipamentoId' }))
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: '0',
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('equipamentoId')))
    })

    test('Deve retornar código 200 em caso de sucesso', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          numFalha: '0',
          equipamentoId: '1'
        },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta('Falha alterada com sucesso'))
    })
  })
})
