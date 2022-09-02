import readlineSync from 'readline-sync'
import { LeitorDeTerminal } from '../../../../dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import { AdaptadorDoReadlineSync } from './adaptador-do-readline-sync'

jest.mock('readline-sync', () => ({
  question (): string {
    return 'Input_qualquer'
  }
}))

const makeSut = (): LeitorDeTerminal => {
  return new AdaptadorDoReadlineSync()
}

describe('AdaptadorDoReadlineSync', () => {
  describe('Método perguntar', () => {
    test('Deve chamar o método perguntar com os valores corretos', () => {
      const sut = makeSut()
      const questionSpy = jest.spyOn(readlineSync, 'question')
      sut.perguntar('Instrução qualquer')
      expect(questionSpy).toHaveBeenCalledWith('Instrução qualquer')
    })

    test('O método perguntar deve retornar os dados digitados pelo usuário', () => {
      const sut = makeSut()
      const input = sut.perguntar('Instrução qualquer')
      expect(input).toBe('Input_qualquer')
    })
  })
})
