import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { AdapatadorJwt } from './adaptador-jwt'
import { Encriptador } from '../../../dados/protocolos/criptografia/encriptador'

const chaveSecreta = process.env.CHAVE_SECRETA

interface SubTipos {
  sut: Encriptador
}

const makeSut = (): SubTipos => {
  const sut = new AdapatadorJwt()
  return {
    sut
  }
}

describe('Adaptador do jwt', () => {
  test('Deve chamar o sign do jwt com o valores corretos', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encriptar('id_qualquer')
    expect(signSpy).toHaveBeenCalledWith({ id: 'id_qualquer' }, chaveSecreta)
  })
})
