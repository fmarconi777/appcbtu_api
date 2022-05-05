import { ControladorDeEquipamento } from './equipamento'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'

const makeSut = (): ControladorDeEquipamento => {
  return new ControladorDeEquipamento()
}

describe('Controlador de equipamentos', () => {
  test('Deve retornar codigo 400 se um nome não for fornecido', async () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        tipo: 'qualuer_tipo',
        num_falha: 1,
        estado: 1,
        estacaoId: 1
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('nome'))
  })
  test('Deve retornar codigo 400 se um tipo não for fornecido', async () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualuer_tipo',
        num_falha: 1,
        estado: 1,
        estacaoId: 1
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
  })
  test('Deve retornar codigo 400 se um num_falha não for fornecido', async () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualuer_tipo',
        estado: 1,
        estacaoId: 1
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('num_falha'))
  })
  test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualuer_tipo',
        num_falha: 1,
        estacaoId: 1
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estado'))
  })
  test('Deve retornar codigo 400 se um estacaoId não for fornecido', async () => {
    const sut = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualuer_tipo',
        num_falha: 1,
        estado: 1
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
  })
})
