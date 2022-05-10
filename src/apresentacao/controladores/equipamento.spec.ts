import { ControladorDeEquipamento } from './equipamento'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroDeEquipamento, DadosEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'
import { ErroDeServidor } from '../erros/erro-de-servidor'

const makeCadastroDeEquipamento = (): CadastroDeEquipamento => {
  class CadastroDeEquipamentoStub implements CadastroDeEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
      const equipamentoFalso = {
        id: 'qualquer_id',
        nome: dadosEquipamento.nome,
        tipo: dadosEquipamento.tipo,
        numFalha: dadosEquipamento.numFalha,
        estado: dadosEquipamento.estado,
        estacaoId: dadosEquipamento.estacaoId
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
        numFalha: 'numFalha_qualquer',
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
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
  })
  test('Deve retornar codigo 400 se um numFalha não for fornecido', async () => {
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
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('numFalha'))
  })
  test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
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
        numFalha: 'numFalha_qualquer',
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
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(inserirSpy).toHaveBeenCalledWith({
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
  test('Deve retornar codigoo 500 se o CadastroDeEquipamentos retornar um erro', async () => {
    const { sut, cadastroDeEquipamentoStub } = makeSut()
    jest.spyOn(cadastroDeEquipamentoStub, 'inserir').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor())
  })
  test('Deve retornar codigoo 200 se dados válidos forem passados', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'qualquer_id',
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
})
