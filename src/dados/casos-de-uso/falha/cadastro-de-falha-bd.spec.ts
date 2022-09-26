import { ModeloFalha } from '../../../dominio/modelos/falha'
import { RepositorioCadastroFalha } from '../../protocolos/bd/falha/repositorio-cadastro-falha'
import { CadastroDeFalhaBD } from './cadastro-de-falha-bd'
import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'

const dadosFalsos = (): ModeloFalha => {
  const data = new Date(Date.now() - 10800000).toISOString()
  return {
    numFalha: 'numFalha_qualquer',
    dataCriacao: (data.substring(0, 19) + 'Z'),
    equipamentoId: 'equipamentoId_qualquer'
  }
}

const makeValidaEquipamentoStub = (): ValidadorBD => {
  class ValidaEquipamentoStub implements ValidadorBD {
    async validar (parametro: any): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEquipamentoStub()
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
  validaEquipamentoStub: ValidadorBD
  repositorioCadastroFalhaStub: RepositorioCadastroFalha
}

const makeSut = (): SubTipos => {
  const repositorioCadastroFalhaStub = makeRepositorioCadastroFalhaStub()
  const validaEquipamentoStub = makeValidaEquipamentoStub()
  const sut = new CadastroDeFalhaBD(validaEquipamentoStub, repositorioCadastroFalhaStub)
  return {
    sut,
    validaEquipamentoStub,
    repositorioCadastroFalhaStub
  }
}

describe('CadastroDefalhaBD', () => {
  test('Deve chamar o validaEquipamento com o valor correto', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEquipamentoStub, 'validar')
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    await sut.inserir(dados)
    expect(validarSpy).toHaveBeenCalledWith(dados.equipamentoId)
  })

  test('Deve retornar um erro caso o validaEquipamento retorne um erro', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    jest.spyOn(validaEquipamentoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    const resposta = sut.inserir(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validaEquipamento retorne false', async () => {
    const { sut, validaEquipamentoStub } = makeSut()
    jest.spyOn(validaEquipamentoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const dados: any = {
      numFalha: 'numFalha_qualquer',
      equipamentoId: 'equipamentoId_qualquer'
    }
    const resposta = await sut.inserir(dados)
    expect(resposta).toBeNull()
  })

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
