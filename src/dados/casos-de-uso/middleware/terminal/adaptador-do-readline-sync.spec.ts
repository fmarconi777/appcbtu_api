import readlineSync from 'readline-sync'
import { AdaptadorDoReadlineSync } from './adaptador-do-readline-sync'

jest.mock('readline-sync', () => ({
  questionEMail (): string {
    return 'email_qualquer@mail.com'
  },

  questionNewPassword (): string {
    return 'senha'
  }
}))

const makeSut = (): AdaptadorDoReadlineSync => {
  return new AdaptadorDoReadlineSync()
}

describe('AdaptadorDoReadlineSync', () => {
  describe('Método perguntarEmail', () => {
    test('Deve chamar o método perguntarEmail com os valores corretos', () => {
      const sut = makeSut()
      const questionSpy = jest.spyOn(readlineSync, 'questionEMail')
      sut.perguntarEmail('Instrução qualquer')
      expect(questionSpy).toHaveBeenCalledWith('Instrução qualquer')
    })

    test('O método perguntarEmail deve retornar os dados digitados pelo usuário', () => {
      const sut = makeSut()
      const input = sut.perguntarEmail('Instrução qualquer')
      expect(input).toBe('email_qualquer@mail.com')
    })
  })

  describe('Método perguntarSenha', () => {
    test('Deve chamar o método perguntarSenha com os valores corretos', () => {
      const sut = makeSut()
      const questionSpy = jest.spyOn(readlineSync, 'questionNewPassword')
      sut.perguntarSenha('Instrução qualquer')
      expect(questionSpy).toHaveBeenCalledWith('Instrução qualquer')
    })

    test('O método perguntarSenha deve retornar os dados digitados pelo usuário', () => {
      const sut = makeSut()
      const input = sut.perguntarSenha('Instrução qualquer')
      expect(input).toBe('senha')
    })
  })
})
