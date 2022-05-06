import { ControladorDeEquipamento } from './equipamento'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento, InserirModeloEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'

const makeCadastroDeEquipamento = (): CadastroDeEquipamento => {
  class CadastroDeEquipamentoStub implements CadastroDeEquipamento {
    async inserir (equipamento: InserirModeloEquipamento): Promise<ModeloEquipamento> {
      const equipamentoFalso = {
        id: 'qualquer_id',
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        num_falha: 'num_falha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
      return await new Promise(resolve => resolve(equipamentoFalso))
    }
  }
  return new CadastroDeEquipamentoStub()
}

interface SutTypes {
  sut: ControladorDeEquipamento
  cadastroDeEquipamentoStub: CadastroDeEquipamento
}

const makeSut = (): SutTypes => {
  const cadastroDeEquipamentoStub = makeCadastroDeEquipamento()
  const sut = new ControladorDeEquipamento(cadastroDeEquipamentoStub)
  return {
    sut,
    cadastroDeEquipamentoStub
  }
}

describe('Controlador de equipamentos', () => {
  test('Deve retornar codigo 400 se um nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        tipo: 'qualquer_tipo',
        num_falha: 'num_falha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
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
        num_falha: 'num_falha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
  })
  test('Deve retornar codigo 400 se um num_falha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('num_falha'))
  })
  test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        num_falha: 'num_falha_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
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
        num_falha: 'num_falha_qualquer',
        estado: 'estado_qualquer'
      }
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
        num_falha: 'num_falha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(inserirSpy).toHaveBeenCalledWith({
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      num_falha: 'num_falha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
})
