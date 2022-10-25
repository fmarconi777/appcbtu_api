import { CadastroAdministradorBD } from './cadastro-de-administrador'
import { RepositorioFuncionario, InserirModeloFuncionario, ModeloFuncionario } from '@/dados/protocolos/bd/funcionario/repositorio-funcionario'
import { GeradorDeHash } from '@/dados/protocolos/criptografia/gerador-de-hash'

const administradorFalso = {
  nome: 'admin',
  email: 'email_valido@mail.com',
  senha: 'senha_hashed',
  administrador: 'true',
  areaId: '9'
}

const makeGeradorDeHashStub = (): GeradorDeHash => {
  class GeradorDeHashStub implements GeradorDeHash {
    async gerar (senha: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new GeradorDeHashStub()
}

const makeRepositorioCadastroFuncionarioStub = (): RepositorioFuncionario => {
  class RepositorioFuncionarioStub implements RepositorioFuncionario {
    async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario | null> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_hashed',
        administrador: 'true',
        areaId: 'areaid_valida'

      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new RepositorioFuncionarioStub()
}

interface SubTipos {
  sut: CadastroAdministradorBD
  repositorioCadastroFuncionarioStub: RepositorioFuncionario
  geradorDeHashStub: GeradorDeHash
}

const makeSut = (): SubTipos => {
  const geradorDeHashStub = makeGeradorDeHashStub()
  const repositorioCadastroFuncionarioStub = makeRepositorioCadastroFuncionarioStub()
  const sut = new CadastroAdministradorBD(geradorDeHashStub, repositorioCadastroFuncionarioStub)
  return {
    sut,
    repositorioCadastroFuncionarioStub,
    geradorDeHashStub
  }
}

describe('Cadastro de administrador', () => {
  test('Deve chamar o geradorDeHash com o valor correto', async () => {
    const { sut, geradorDeHashStub } = makeSut()
    const gerarSpy = jest.spyOn(geradorDeHashStub, 'gerar')
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    await sut.cadastrar(senha, email)
    expect(gerarSpy).toHaveBeenCalledWith(senha)
  })

  test('Deve retornar um erro caso o geradorDeHash retorne um erro', async () => {
    const { sut, geradorDeHashStub } = makeSut()
    jest.spyOn(geradorDeHashStub, 'gerar').mockReturnValueOnce(Promise.reject(new Error()))
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    const resposta = sut.cadastrar(senha, email)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o repositorioCadastroFuncionario com os valores corretos', async () => {
    const { sut, repositorioCadastroFuncionarioStub } = makeSut()
    const adicionarSpy = jest.spyOn(repositorioCadastroFuncionarioStub, 'adicionar')
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    await sut.cadastrar(senha, email)
    expect(adicionarSpy).toHaveBeenCalledWith(administradorFalso)
  })

  test('Deve retornar um erro caso o repositorioCadastroFuncionario retorne um erro', async () => {
    const { sut, repositorioCadastroFuncionarioStub } = makeSut()
    jest.spyOn(repositorioCadastroFuncionarioStub, 'adicionar').mockReturnValueOnce(Promise.reject(new Error()))
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    const resposta = sut.cadastrar(senha, email)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Erro ao cadastrar a conta admin" em caso de falha', async () => {
    const { sut, repositorioCadastroFuncionarioStub } = makeSut()
    jest.spyOn(repositorioCadastroFuncionarioStub, 'adicionar').mockReturnValueOnce(Promise.resolve(null))
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    const resposta = await sut.cadastrar(senha, email)
    expect(resposta).toEqual('Erro ao cadastrar a conta admin')
  })

  test('Deve retornar a mensagem "Conta admin cadastrada com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const senha = 'senha_qualquer'
    const email = 'email_valido@mail.com'
    const resposta = await sut.cadastrar(senha, email)
    expect(resposta).toEqual('Conta admin cadastrada com sucesso')
  })
})
