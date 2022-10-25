import { BdAdicionarConta } from './bd-adicionar-conta'
import { ModeloFuncionario } from '@/dominio/modelos/funcionario'
import { GeradorDeHash } from '@/dados/protocolos/criptografia/gerador-de-hash'
import { RepositorioConsultaFuncionarioPorEmail } from '@/dados/protocolos/bd/funcionario/repositorio-consulta-funcionario-por-email'
import { InserirModeloFuncionario, RepositorioFuncionario } from '@/dados/protocolos/bd/funcionario/repositorio-funcionario'

const makeGeradorDeHash = (): GeradorDeHash => {
  class GeradorDeHashStub implements GeradorDeHash {
    async gerar (value: string): Promise<string> {
      return await new Promise(resolve => resolve('senha_hashed'))
    }
  }
  return new GeradorDeHashStub()
}

const makeRepositorioFuncionario = (): RepositorioFuncionario => {
  class RepositorioFuncionarioStub implements RepositorioFuncionario {
    async adicionar (contaData: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_hashed',
        administrador: 'administrador_valido',
        areaId: 'areaid_valido'

      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new RepositorioFuncionarioStub()
}

const makeRepositorioConsultaFuncionarioPorEmail = (): RepositorioConsultaFuncionarioPorEmail => {
  class RepositorioConsultaFuncionarioPorEmailStub implements RepositorioConsultaFuncionarioPorEmail {
    async consultarPorEmail (email: string): Promise<ModeloFuncionario | null> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new RepositorioConsultaFuncionarioPorEmailStub()
}

interface SutTipos {
  sut: BdAdicionarConta
  geradorDeHashStub: GeradorDeHash
  repositorioFuncionarioStub: RepositorioFuncionario
  repositorioConsultaFuncionarioPorEmailStub: RepositorioConsultaFuncionarioPorEmail
}

const makeSut = (): SutTipos => {
  const repositorioConsultaFuncionarioPorEmailStub = makeRepositorioConsultaFuncionarioPorEmail()
  const geradorDeHashStub = makeGeradorDeHash()
  const repositorioFuncionarioStub = makeRepositorioFuncionario()
  const sut = new BdAdicionarConta(geradorDeHashStub, repositorioFuncionarioStub, repositorioConsultaFuncionarioPorEmailStub)
  return {
    sut,
    geradorDeHashStub,
    repositorioFuncionarioStub,
    repositorioConsultaFuncionarioPorEmailStub
  }
}

describe('CasodeUso BdAdicionarConta', () => {
  test('Deverá chamar o GeradorDeHash com a senha correta', async () => {
    const { sut, geradorDeHashStub } = makeSut()
    const gerarEspionar = jest.spyOn(geradorDeHashStub, 'gerar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    await sut.adicionar(dataConta)
    expect(gerarEspionar).toHaveBeenCalledWith('senha_valido')
  })

  test('Deverá jogar o GeradorDeHash se ele estiver na condiçao de throw', async () => {
    const { sut, geradorDeHashStub } = makeSut()
    jest.spyOn(geradorDeHashStub, 'gerar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })

  test('Deverá chamar o AdicionarContaRepositorio com os valores corretos', async () => {
    const { sut, repositorioFuncionarioStub } = makeSut()
    const adicionarEspionar = jest.spyOn(repositorioFuncionarioStub, 'adicionar')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    await sut.adicionar(dataConta)
    expect(adicionarEspionar).toHaveBeenCalledWith({
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_hashed',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    })
  })

  test('Deverá jogar o GeradorDeHash se o AdicionarContaRepositorio estiver na condiçao de throw', async () => {
    const { sut, repositorioFuncionarioStub } = makeSut()
    jest.spyOn(repositorioFuncionarioStub, 'adicionar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const promise = sut.adicionar(dataConta)
    await expect(promise).rejects.toThrow()
  })

  test('Deverá retornar uma conta se der sucesso', async () => {
    const { sut } = makeSut()
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const conta = await sut.adicionar(dataConta)
    expect(conta).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: undefined,
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    })
  })

  test('Deve chamar RepositorioConsultaFuncionarioPorEmail com o email correto', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    const consultaPorEmailSpy = jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consultarPorEmail')
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    await sut.adicionar(dataConta)
    expect(consultaPorEmailSpy).toHaveBeenCalledWith('email_valido@mail.com')
  })

  test('Deverá retornar null se RepositorioConsultaFuncionarioPorEmail não retornar null', async () => {
    const { sut, repositorioConsultaFuncionarioPorEmailStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorEmailStub, 'consultarPorEmail').mockReturnValueOnce(new Promise(resolve => resolve({
      id: 'id_qualquer',
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    })))
    const dataConta = {
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'areaid_valido'
    }
    const conta = await sut.adicionar(dataConta)
    expect(conta).toBeNull()
  })
})
