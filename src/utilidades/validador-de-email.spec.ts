import { ValidadorDeEmailAdaptador } from './auxiliares/validador-de-email'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): ValidadorDeEmailAdaptador => {
  return new ValidadorDeEmailAdaptador()
}
describe('Validador de Email', () => {
  test('Deverá retornará falso se o validador retornar falso', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const validar = sut.validar('email_invalido@mail.com')
    expect(validar).toBe(false)
  })
  test('Deverá retornar verdadeiro se o validador retornar verdadeiro', () => {
    const sut = makeSut()
    const validar = sut.validar('email_valido@mail.com')
    expect(validar).toBe(true)
  })
  test('Deverá chamar o validator com o email correto', () => {
    const sut = makeSut()
    const isEmailEspionar = jest.spyOn(validator, 'isEmail')
    sut.validar('qualquer_email@mail.com')
    expect(isEmailEspionar).toHaveBeenCalledWith('qualquer_email@mail.com')
  })
})
