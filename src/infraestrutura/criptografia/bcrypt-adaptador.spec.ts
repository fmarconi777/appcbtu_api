import bcrypt from 'bcrypt'
import { BcryptAdaptador } from './bcrypt-adaptador'
import 'dotenv/config'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = process.env.SALT
const makeSut = (): BcryptAdaptador => {
  return new BcryptAdaptador()
}
describe('Bcrypt Adaptador', () => {
  test('Deverá chamar o bcrypt com valores corretos', async () => {
    const sut = makeSut()
    const hashEspionar = jest.spyOn(bcrypt, 'hash')
    await sut.gerar('qualquer_valor')
    expect(hashEspionar).toHaveBeenCalledWith('qualquer_valor', +(salt as string))
  })
  test('Deverá retornar um hash em caso de sucesso', async () => {
    const sut = makeSut()
    const hash = await sut.gerar('qualquer_valor')
    expect(hash).toBe('hash')
  })
  test('Deverá retornar condição throw caso bcrypt esteja em throw ', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error())) // eslint-disable-line
    const promise = sut.gerar('qualquer_valor')
    await expect(promise).rejects.toThrow()
  })
})
