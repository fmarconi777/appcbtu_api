import { Validador } from '../../apresentacao/protocolos/validador'
import { ValidadorDeArea } from './validador-de-area'
import { validador } from '../auxiliares/auxiliar-validador'

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

  test('Deve chamar o validador com o parametro correto', () => {
    const sut = makeSut()
    const eAreaSpy = jest.spyOn(validador, 'eArea')
    sut.validar('area_qualquer')
    expect(eAreaSpy).toHaveBeenCalledWith('area_qualquer')
  })

  test('Deve retornar true se o validador retornar true', () => {
    const sut = makeSut()
    const eValido = sut.validar('COINF')
    expect(eValido).toBe(true)
  })
})
