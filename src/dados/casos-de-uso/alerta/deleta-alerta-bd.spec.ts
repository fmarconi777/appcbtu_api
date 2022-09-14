import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { DeletaAlertaBD } from './deleta-alerta-bd'

const makeValidadorDeAlertaStub = (): ValidadorBD => {
  class ValidadorDeAlertaStub implements ValidadorBD {
    async validar (id: number): Promise<boolean> {
      return true
    }
  }
  return new ValidadorDeAlertaStub()
}

interface SubTipos {
  sut: DeletaAlertaBD
  validadorDeAlerta: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validadorDeAlerta = makeValidadorDeAlertaStub()
  const sut = new DeletaAlertaBD(validadorDeAlerta)
  return {
    sut,
    validadorDeAlerta
  }
}

describe('DeletaAlertaBD', () => {
  test('Deve chamar o validaAlerta com o valor correto', async () => {
    const { sut, validadorDeAlerta } = makeSut()
    const validarSpy = jest.spyOn(validadorDeAlerta, 'validar')
    await sut.deletar(1)
    expect(validarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar um erro caso o validaAlerta retorne um erro', async () => {
    const { sut, validadorDeAlerta } = makeSut()
    jest.spyOn(validadorDeAlerta, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar(1)
    await expect(resposta).rejects.toThrow()
  })
})
