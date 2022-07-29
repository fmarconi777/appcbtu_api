import { ControladorDeEquipamento } from './equipamento'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento, DadosEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'
import { erroDeServidor, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { AlteraCadastroDeEquipamento, EquipamentoValido } from '../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { AlteraEstadoDeEquipamento, EstadoEquipamento } from '../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'

const makeCadastroDeEquipamento = (): CadastroDeEquipamento => {
  class CadastroDeEquipamentoStub implements CadastroDeEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<string | boolean> {
      return await new Promise(resolve => resolve('Equipamento cadastrado com sucesso'))
    }
  }
  return new CadastroDeEquipamentoStub()
}

const dadosFalsos = {
  id: 'id_qualquer',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: 'estacaoId_qualquer'
}

const makeConsultaEquipamentoStub = (): ConsultaEquipamento => {
  class ConsultaEquipamentoStub implements ConsultaEquipamento {
    async consultarTodos (): Promise<ModeloEquipamento[]> {
      return await new Promise(resolve => resolve([dadosFalsos]))
    }

    async consultar (id: number): Promise<ModeloEquipamento | null> {
      return await new Promise(resolve => resolve(dadosFalsos))
    }
  }
  return new ConsultaEquipamentoStub()
}

const makeAlteraCadastroDeEquipamentoStub = (): AlteraCadastroDeEquipamento => {
  class AlteraCadastroDeEquipamentoStub implements AlteraCadastroDeEquipamento {
    async alterar (dadosEquipamento: ModeloEquipamento): Promise<EquipamentoValido> {
      return await new Promise(resolve => resolve({
        invalido: false,
        parametro: '',
        cadastro: 'Cadastro alterado com sucesso'
      }))
    }
  }
  return new AlteraCadastroDeEquipamentoStub()
}

const makeAlteraEstadoDeEquipamentoStub = (): AlteraEstadoDeEquipamento => {
  class AlteraEstadoDeEquipamentoStub implements AlteraEstadoDeEquipamento {
    async alterar (dadosEquipamento: EstadoEquipamento): Promise<string | null> {
      return await new Promise(resolve => resolve('Estado alterado com sucesso'))
    }
  }
  return new AlteraEstadoDeEquipamentoStub()
}

interface SutTypes {
  sut: ControladorDeEquipamento
  cadastroDeEquipamentoStub: CadastroDeEquipamento
  consultaEquipamentoStub: ConsultaEquipamento
  alteraCadastroDeEquipamentoStub: AlteraCadastroDeEquipamento
  alteraEstadoDeEquipamentoStub: AlteraEstadoDeEquipamento
}

const makeSut = (): SutTypes => {
  const alteraEstadoDeEquipamentoStub = makeAlteraEstadoDeEquipamentoStub()
  const alteraCadastroDeEquipamentoStub = makeAlteraCadastroDeEquipamentoStub()
  const consultaEquipamentoStub = makeConsultaEquipamentoStub()
  const cadastroDeEquipamentoStub = makeCadastroDeEquipamento()
  const sut = new ControladorDeEquipamento(cadastroDeEquipamentoStub, consultaEquipamentoStub, alteraCadastroDeEquipamentoStub, alteraEstadoDeEquipamentoStub)
  return {
    sut,
    cadastroDeEquipamentoStub,
    consultaEquipamentoStub,
    alteraCadastroDeEquipamentoStub,
    alteraEstadoDeEquipamentoStub
  }
}

describe('Controlador de equipamentos', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      },
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método DELETE', () => {
    test('Deve retornar status 404 caso o parametro seja inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        metodo: 'DELETE'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })
  })

  describe('Método PATCH', () => {
    test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {},
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estado'))
    })

    test('Deve retornar status 404 caso o parametro seja inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        corpo: { estado: '1' },
        metodo: 'PATCH'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve chamar o alteraEstadoDeEquipamento com os valores corretos', async () => {
      const { sut, alteraEstadoDeEquipamentoStub } = makeSut()
      const alterarSpy = jest.spyOn(alteraEstadoDeEquipamentoStub, 'alterar')
      const requisicaoHttp = {
        parametro: '1',
        corpo: { estado: '1' },
        metodo: 'PATCH'
      }
      await sut.tratar(requisicaoHttp)
      expect(alterarSpy).toHaveBeenCalledWith({
        id: '1',
        estado: '1'
      })
    })

    test('Deve retornar codigo 500 se o alteraEstadoDeEquipamento retornar um erro', async () => {
      const { sut, alteraEstadoDeEquipamentoStub } = makeSut()
      jest.spyOn(alteraEstadoDeEquipamentoStub, 'alterar').mockImplementationOnce(async () => (await new Promise((resolve, reject) => reject(new Error()))))
      const requisicaoHttp = {
        parametro: '1',
        corpo: { estado: '1' },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 404 caso o alteraEstadoDeEquipamento retorne null', async () => {
      const { sut, alteraEstadoDeEquipamentoStub } = makeSut()
      jest.spyOn(alteraEstadoDeEquipamentoStub, 'alterar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        parametro: '1',
        corpo: { estado: '1' },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar codigo 200 se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: { estado: '1' },
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta('Estado alterado com sucesso'))
    })
  })

  describe('Método PUT', () => {
    test('Deve retornar codigo 400 se um nome não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          id: 'id_qualquer',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('nome'))
    })

    test('Deve retornar codigo 400 se um tipo não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          id: 'id_qualquer',
          nome: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
    })

    test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          id: 'id_qualquer',
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estado'))
    })

    test('Deve retornar codigo 400 se um estacaoId não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: {
          id: 'id_qualquer',
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer'
        },
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
    })

    test('Deve retornar status 404 caso o parametro seja inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toBe(404)
      expect(resposta.corpo).toEqual(new ErroParametroInvalido('id'))
    })

    test('Deve chamar o alteraCadastroDeEquipamento com os valores corretos', async () => {
      const { sut, alteraCadastroDeEquipamentoStub } = makeSut()
      const inserirSpy = jest.spyOn(alteraCadastroDeEquipamentoStub, 'alterar')
      const requisicaoHttp = {
        parametro: '1',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith(dadosFalsos)
    })

    test('Deve retornar codigo 500 se o alteraCadastroDeEquipamento retornar um erro', async () => {
      const { sut, alteraCadastroDeEquipamentoStub } = makeSut()
      jest.spyOn(alteraCadastroDeEquipamentoStub, 'alterar').mockImplementationOnce(async () => (await new Promise((resolve, reject) => reject(new Error()))))
      const requisicaoHttp = {
        parametro: '1',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 404 caso o parametro id esteja incorreto', async () => {
      const { sut, alteraCadastroDeEquipamentoStub } = makeSut()
      jest.spyOn(alteraCadastroDeEquipamentoStub, 'alterar').mockReturnValueOnce(Promise.resolve({ invalido: true, parametro: 'id' }))
      const requisicaoHttp = {
        parametro: '1',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar status 404 caso o parametro estacaoId esteja incorreto', async () => {
      const { sut, alteraCadastroDeEquipamentoStub } = makeSut()
      jest.spyOn(alteraCadastroDeEquipamentoStub, 'alterar').mockReturnValueOnce(Promise.resolve({ invalido: true, parametro: 'estacaoId' }))
      const requisicaoHttp = {
        parametro: '1',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId')))
    })

    test('Deve retornar codigo 200 se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        corpo: dadosFalsos,
        metodo: 'PUT'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual('Cadastro alterado com sucesso')
    })
  })

  describe('Método POST', () => {
    test('Deve retornar codigo 400 se um nome não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('nome'))
    })
    test('Deve retornar codigo 400 se um tipo não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
    })
    test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estado'))
    })
    test('Deve retornar codigo 400 se um estacaoId não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
    })
    test('Deve chamar o CadastroDeEquipamento com os valores corretos', async () => {
      const { sut, cadastroDeEquipamentoStub } = makeSut()
      const inserirSpy = jest.spyOn(cadastroDeEquipamentoStub, 'inserir')
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith({
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      })
    })
    test('Deve retornar status 404 caso o CadastroDeEquipamento retorne false', async () => {
      const { sut, cadastroDeEquipamentoStub } = makeSut()
      jest.spyOn(cadastroDeEquipamentoStub, 'inserir').mockReturnValueOnce(Promise.resolve(false))
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId')))
    })
    test('Deve retornar codigo 500 se o CadastroDeEquipamentos retornar um erro', async () => {
      const { sut, cadastroDeEquipamentoStub } = makeSut()
      jest.spyOn(cadastroDeEquipamentoStub, 'inserir').mockImplementationOnce(async () => (await new Promise((resolve, reject) => reject(new Error()))))
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })
    test('Deve retornar codigo 200 e a mensagem  se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'qualquer_nome',
          tipo: 'qualquer_tipo',
          estado: 'estado_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual('Equipamento cadastrado com sucesso')
    })
  })

  describe('Método GET', () => {
    test('Deve retornar todos os equipamentos caso um parametro não seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { metodo: 'GET' }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toBe(200)
      expect(resposta.corpo).toEqual([dadosFalsos])
    })

    test('Deve retornar status 500 caso o método consultarTodos retorne um erro', async () => {
      const { sut, consultaEquipamentoStub } = makeSut()
      jest.spyOn(consultaEquipamentoStub, 'consultarTodos').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const requisicaoHttp = {
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 404 caso o parametro seja inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toBe(404)
      expect(resposta.corpo).toEqual(new ErroParametroInvalido('id'))
    })

    test('Deve chamar o método consultar do consultaEquipamento com o valor correto', async () => {
      const { sut, consultaEquipamentoStub } = makeSut()
      const consultarSpy = jest.spyOn(consultaEquipamentoStub, 'consultar')
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      await sut.tratar(requisicaoHttp)
      expect(consultarSpy).toHaveBeenCalledWith(1)
    })

    test('Deve retornar um equipamento caso um parametro seja fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toBe(200)
      expect(resposta.corpo).toEqual(dadosFalsos)
    })

    test('Deve retornar 404 se o método consultar retornar null', async () => {
      const { sut, consultaEquipamentoStub } = makeSut()
      jest.spyOn(consultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar status 500 caso o método consultar retorne um erro', async () => {
      const { sut, consultaEquipamentoStub } = makeSut()
      jest.spyOn(consultaEquipamentoStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })
  })
})
