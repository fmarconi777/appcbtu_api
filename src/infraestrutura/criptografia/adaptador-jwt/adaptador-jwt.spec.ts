import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { AdapatadorJwt } from './adaptador-jwt'

const chaveSecreta = process.env.CHAVE_SECRETA

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'token_qualquer'
  },

  verify (): string {
    return 'valor_qualquer'
  }
}))

const makeSut = (): AdapatadorJwt => {
  const sut = new AdapatadorJwt()
  return sut
}

describe('Adaptador do jwt', () => {
  describe('Metodo encriptar', () => {
    test('Deve chamar o sign do jwt com o valores corretos', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encriptar('id_qualquer')
      expect(signSpy).toHaveBeenCalledWith({ id: 'id_qualquer' }, chaveSecreta, { expiresIn: '4h' })
    })

    test('Deve retornar um token em caso de sucesso', async () => {
      const sut = makeSut()
      const tokenDeAcesso = await sut.encriptar('id_qualquer')
      expect(tokenDeAcesso).toBe('token_qualquer')
    })

    test('Deve retornar um erro caso o sign retorne um erro', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(new Error())) // eslint-disable-line
      const tokenDeAcesso = sut.encriptar('id_qualquer')
      await expect(tokenDeAcesso).rejects.toThrow()
    })
  })

  describe('Metodo decriptar', () => {
    test('Deve chamar o verify do jwt com o valores corretos', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decriptar('token_qualquer')
      expect(verifySpy).toHaveBeenCalledWith('token_qualquer', chaveSecreta)
    })

    test('Deve retornar um valor em caso de sucesso', async () => {
      const sut = makeSut()
      const tokenDeAcesso = await sut.decriptar('token_qualquer')
      expect(tokenDeAcesso).toBe('valor_qualquer')
    })

    test('Deve retornar um erro caso o verify retorne um erro', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => Promise.reject(new Error())) // eslint-disable-line
      const tokenDeAcesso = sut.decriptar('token_qualquer')
      await expect(tokenDeAcesso).rejects.toThrow()
    })
  })
})
