import { CadastroAdministradorBD } from './cadastro-de-administrador'
import { GeradorDeHash } from '../../../protocolos/criptografia/gerador-de-hash'

const makeGeradorDeHashStub = (): GeradorDeHash => {
  class GeradorDeHashStub implements GeradorDeHash {
    async gerar (senha: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new GeradorDeHashStub()
}

interface SubTipos {
  sut: CadastroAdministradorBD
  geradorDeHashStub: GeradorDeHash
}

const makeSut = (): SubTipos => {
  const geradorDeHashStub = makeGeradorDeHashStub()
  const sut = new CadastroAdministradorBD(geradorDeHashStub)
  return {
    sut,
    geradorDeHashStub
  }
}

describe('Cadastro de administrador', () => {
  test('Deve chamar o geradorDeHash com o valor correto', async () => {
    const { sut, geradorDeHashStub } = makeSut()
    const gerarSpy = jest.spyOn(geradorDeHashStub, 'gerar')
    const senha = 'senha_qualquer'
    const email = 'email_qualquer'
    await sut.cadastrar(senha, email)
    expect(gerarSpy).toHaveBeenCalledWith(senha)
  })
})
