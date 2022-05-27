import bcrypt from 'bcrypt'
import { BcryptAdaptador } from './bcrypt-adaptador'
import 'dotenv/config'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = process.env.SALT
const makeSut = (): BcryptAdaptador => {
  return new BcryptAdaptador()
}

describe('Bcrypt Adaptador', () => {
  test('Deverá chamar o método gerar com os valores corretos', async () => {
    const sut = makeSut()
    const hashEspionar = jest.spyOn(bcrypt, 'hash')
    await sut.gerar('qualquer_valor')
    expect(hashEspionar).toHaveBeenCalledWith('qualquer_valor', +(salt as string))
  })

  test('Deverá retornar um hash válido em caso de sucesso', async () => {
    const sut = makeSut()
    const hash = await sut.gerar('qualquer_valor')
    expect(hash).toBe('hash')
  })

  test('Deverá retornar um erro caso bcrypt retorne um erro', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error())) // eslint-disable-line
    const promise = sut.gerar('qualquer_valor')
    await expect(promise).rejects.toThrow()
  })

  test('Deverá chamar o método comparar com valores corretos', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.comparar('qualquer_valor', 'hash_qualquer')
    expect(compareSpy).toHaveBeenCalledWith('qualquer_valor', 'hash_qualquer')
  })

  test('Deverá retornar true caso o método comparar retorne true', async () => {
    const sut = makeSut()
    const coincide = await sut.comparar('qualquer_valor', 'hash_qualquer')
    expect(coincide).toBe(true)
  })
})
