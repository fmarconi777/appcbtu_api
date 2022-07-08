import { ControladorDeEquipamento } from './equipamento'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento, DadosEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaEquipamento } from '../../dominio/casos-de-uso/equipamento/consulta-equipamento'
import { erroDeServidor } from '../auxiliares/auxiliar-http'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'

const makeCadastroDeEquipamento = (): CadastroDeEquipamento => {
  class CadastroDeEquipamentoStub implements CadastroDeEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
      const equipamentoFalso = {
        id: 'qualquer_id',
        nome: dadosEquipamento.nome,
        tipo: dadosEquipamento.tipo,
        estado: dadosEquipamento.estado,
        estacaoId: dadosEquipamento.estacaoId
      }
      return await new Promise(resolve => resolve(equipamentoFalso))
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

    async consultar (id: number): Promise<ModeloEquipamento | string> {
      return await new Promise(resolve => resolve(dadosFalsos))
    }
  }
  return new ConsultaEquipamentoStub()
}

interface SutTypes {
  sut: ControladorDeEquipamento
  cadastroDeEquipamentoStub: CadastroDeEquipamento
  consultaEquipamentoStub: ConsultaEquipamento
}

const makeSut = (): SutTypes => {
  const consultaEquipamentoStub = makeConsultaEquipamentoStub()
  const cadastroDeEquipamentoStub = makeCadastroDeEquipamento()
  const sut = new ControladorDeEquipamento(cadastroDeEquipamentoStub, consultaEquipamentoStub)
  return {
    sut,
    cadastroDeEquipamentoStub,
    consultaEquipamentoStub
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
    test('Deve retornar codigoo 500 se o CadastroDeEquipamentos retornar um erro', async () => {
      const { sut, cadastroDeEquipamentoStub } = makeSut()
      const erroFalso = new Error()
      erroFalso.stack = 'stack_qualquer'
      jest.spyOn(cadastroDeEquipamentoStub, 'inserir').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erroFalso))
      })
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
      expect(respostaHttp.status).toBe(500)
      expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    })
    test('Deve retornar codigoo 200 se dados válidos forem passados', async () => {
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
      expect(respostaHttp.corpo).toEqual({
        id: 'qualquer_id',
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      })
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

    test('Deve retornar a mensagem "Equipamento não cadastrado" caso um parametro não cadastrado seja fornecido', async () => {
      const { sut, consultaEquipamentoStub } = makeSut()
      jest.spyOn(consultaEquipamentoStub, 'consultar').mockReturnValueOnce(new Promise(resolve => resolve('Equipamento não cadastrado')))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'GET'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toBe(200)
      expect(resposta.corpo).toEqual('Equipamento não cadastrado')
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
