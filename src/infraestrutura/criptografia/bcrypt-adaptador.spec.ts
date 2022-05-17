import bcrypt from 'bcrypt'
import { BcryptAdaptador } from './bcrypt-adaptador'
describe('Bcrypt Adaptador', () => {
  test('Deverá chamar o bcrypt com valores corretos', async () => {
    const salt = 12
    const sut = new BcryptAdaptador(salt)
    const hashEspionar = jest.spyOn(bcrypt, 'hash')
    await sut.encriptar('qualquer_valor')
    expect(hashEspionar).toHaveBeenLastCalledWith('qualquer_valor', salt)
  })
})
