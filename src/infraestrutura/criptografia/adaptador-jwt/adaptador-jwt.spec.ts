import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { AdapatadorJwt } from './adaptador-jwt'
import { Encriptador } from '../../../dados/protocolos/criptografia/encriptador'

const chaveSecreta = process.env.CHAVE_SECRETA

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'token_qualquer'
  }
}))

const makeSut = (): Encriptador => {
  const sut = new AdapatadorJwt()
  return sut
}

describe('Adaptador do jwt', () => {
  test('Deve chamar o sign do jwt com o valores corretos', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encriptar('id_qualquer')
    expect(signSpy).toHaveBeenCalledWith({ id: 'id_qualquer' }, chaveSecreta)
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
