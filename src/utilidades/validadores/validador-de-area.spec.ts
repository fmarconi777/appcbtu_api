import { ValidadorArea } from '../../apresentacao/protocolos/validador-area'
import { ValidadorDeArea } from './validador-de-area'

const makeSut = (): ValidadorArea => {
  const sut = new ValidadorDeArea()
  return sut
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', async () => {
    const sut = makeSut()
    const eValido = await sut.validar('AREA_INVALIDA')
    expect(eValido).toBe(false)
  })

  test('Deve retornar true se o validador retornar true', async () => {
    const sut = makeSut()
    const eValido = await sut.validar('COINF')
    expect(eValido).toBe(true)
  })
})
