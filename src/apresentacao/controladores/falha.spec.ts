import { requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ControladorDeFalha } from './falha'

const falhaFalsa = {
  numFalha: 'numero_qualquer',
  equipamentoId: 'equipamentoId_qualquer'
}

interface SubTipos {
  sut: ControladorDeFalha
}

const makeSut = (): SubTipos => {
  const sut = new ControladorDeFalha()
  return {
    sut
  }
}

describe('ControladorDeFalha', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: falhaFalsa,
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método POST', () => {
    test('Deve retornar codigo 400 caso o parametro numFalha esteja faltando', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          equipamentoId: 'equipamentoId_qualquer'
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
  })
})
