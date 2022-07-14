import { requisicaoImpropria } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ValidadorBD } from '../protocolos/validadorBD'
import { ControladorDeFalha } from './falha'

const makeValidaEquipamentoStub = (): ValidadorBD => {
  class ValidaEquipamentoStub implements ValidadorBD {
    async validar (parametro: any): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEquipamentoStub()
}

const falhaFalsa = {
  numFalha: 'numero_qualquer',
  equipamentoId: '1'
}

interface SubTipos {
  sut: ControladorDeFalha
  validaEquipamentoStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validaEquipamentoStub = makeValidaEquipamentoStub()
  const sut = new ControladorDeFalha(validaEquipamentoStub)
  return {
    sut,
    validaEquipamentoStub
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

    test('Deve chamar o validaEquipamento com o valor correto', async () => {
      const { sut, validaEquipamentoStub } = makeSut()
      const validarSpy = jest.spyOn(validaEquipamentoStub, 'validar')
      const requisicaoHttp = {
        corpo: falhaFalsa,
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(validarSpy).toHaveBeenCalledWith(1)
    })
  })
})
