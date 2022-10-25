import { ValidadorDeSigla } from './validador-de-sigla'
import { Validador } from '@/apresentacao/protocolos/validador'
import { validador } from '@/utilidades/auxiliares/auxiliar-validador'

const makeSut = (): Validador => {
  const sut = new ValidadorDeSigla()
  return sut
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', () => {
    const sut = makeSut()
    const eValido = sut.validar('sigla_invalida')
    expect(eValido).toBe(false)
  })

  test('Deve retornar true se o validador retornar true', () => {
    const sut = makeSut()
    const eValido = sut.validar('uel')
    expect(eValido).toBe(true)
  })

  test('Deve chamar o validador com o parametro correto', () => {
    const sut = makeSut()
    const eSiglaSpy = jest.spyOn(validador, 'eSigla')
    sut.validar('sigla_qualquer')
    expect(eSiglaSpy).toHaveBeenCalledWith('sigla_qualquer')
  })
})
