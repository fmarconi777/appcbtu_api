import { Validador } from '../../apresentacao/protocolos/validador'
import { validador } from '../auxiliares/auxiliar-validador'
import { ValidadorDeAlerta } from './validador-de-alerta'

const makeSut = (): Validador => {
  const sut = new ValidadorDeAlerta()
  return sut
}

describe('Validador de parametro', () => {
  test('Deve retornar false se o validador retornar falso', () => {
    const sut = makeSut()
    const eValido = sut.validar('alerta_invalido')
    expect(eValido).toBe(false)
  })

  test('Deve chamar o validador com o parametro correto', () => {
    const sut = makeSut()
    const eAlertaSpy = jest.spyOn(validador, 'eAlerta')
    sut.validar('alerta_qualquer')
    expect(eAlertaSpy).toHaveBeenCalledWith('alerta_qualquer')
  })

  test('Deve retornar true se o validador retornar true', () => {
    const sut = makeSut()
    const eValido = sut.validar('ALTA')
    expect(eValido).toBe(true)
  })
})
