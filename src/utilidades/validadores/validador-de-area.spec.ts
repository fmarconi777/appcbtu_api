import { Validador } from '../../apresentacao/protocolos/validador'
import { ValidadorDeArea } from './validador-de-area'

const makeSut = (): Validador => {
  const sut = new ValidadorDeArea()
  return sut
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', () => {
    const sut = makeSut()
    const eValido = sut.validar('area_invalida')
    expect(eValido).toBe(false)
  })
})
