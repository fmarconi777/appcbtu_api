import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioCadastroFalha } from '../../protocolos/bd/falha/repositorio-cadastro-falha'
import { CadastroDeFalhaBD } from './cadastro-de-falha-bd'

const dadosFalsos = (): ModeloFalha => {
  const data = new Date(Date.now() - 10800000).toISOString()
  return {
    numFalha: 'numFalha_qualquer',
    dataCriacao: (data.substring(0, 19) + 'Z'),
    equipamentoId: 'equipamentoId_qualquer'
  }
}

const makeRepositorioCadastroFalhaStub = (): RepositorioCadastroFalha => {
  class RepositorioCadastroFalhaStub implements RepositorioCadastroFalha {
    async inserir (dados: ModeloFalha): Promise<string> {
      return await new Promise(resolve => resolve('Falha cadastrada com sucesso'))
    }
  }
  return new RepositorioCadastroFalhaStub()
}

interface SubTipos {
  sut: CadastroDeFalhaBD
  repositorioCadastroFalhaStub: RepositorioCadastroFalha
}

const makeSut = (): SubTipos => {
  const repositorioCadastroFalhaStub = makeRepositorioCadastroFalhaStub()
  const sut = new CadastroDeFalhaBD(repositorioCadastroFalhaStub)
  return {
    sut,
    repositorioCadastroFalhaStub
  }
}

describe('CadastroDefalhaBD', () => {
  test('Deve chamar o repositorioFalha com os valores corretos', async () => {
    const { sut, repositorioCadastroFalhaStub } = makeSut()
    const inserirSpy = jest.spyOn(repositorioCadastroFalhaStub, 'inserir')
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    await sut.inserir(dados)
    expect(inserirSpy).toHaveBeenCalledWith(dadosFalsos())
  })

  test('Deve retornar um erro caso o repositorioFalha retorne um erro', async () => {
    const { sut, repositorioCadastroFalhaStub } = makeSut()
    jest.spyOn(repositorioCadastroFalhaStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    const resposta = sut.inserir(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Falha cadastrada com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    const resposta = await sut.inserir(dados)
    expect(resposta).toEqual('Falha cadastrada com sucesso')
  })
})
