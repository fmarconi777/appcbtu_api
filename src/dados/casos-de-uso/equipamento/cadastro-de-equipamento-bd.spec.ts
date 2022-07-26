import { ValidadorBD } from '../../../apresentacao/protocolos/validadorBD'
import { DadosEquipamento } from '../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { RepositorioEquipamento } from '../../protocolos/bd/equipamento/repositorio-equipamento'
import { CadastroDeEquipamentoBd } from './cadastro-de-equipamento-bd'

const makeRepositorioEquimento = (): RepositorioEquipamento => {
  class RepositorioEquipamentoStub implements RepositorioEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<string> {
      return await new Promise(resolve => resolve('Equipamento cadastrado com sucesso'))
    }
  }
  return new RepositorioEquipamentoStub()
}

const makeValidaEstacaoStub = (): ValidadorBD => {
  class ValidaEstacaoStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEstacaoStub()
}

const equipamentoFalso = {
  nome: 'qualquer_nome',
  tipo: 'qualquer_tipo',
  estado: 'estado_qualquer',
  estacaoId: '1'
}

interface SutTypes {
  sut: CadastroDeEquipamentoBd
  repositorioEquipamentoStub: RepositorioEquipamento
  validaEstacaoStub: ValidadorBD
}

const makeSut = (): SutTypes => {
  const validaEstacaoStub = makeValidaEstacaoStub()
  const repositorioEquipamentoStub = makeRepositorioEquimento()
  const sut = new CadastroDeEquipamentoBd(repositorioEquipamentoStub, validaEstacaoStub)
  return {
    sut,
    validaEstacaoStub,
    repositorioEquipamentoStub
  }
}

describe('Caso de uso CadastroDeEquipamentoBd', () => {
  test('Deve chamar o validaEstacao com o valor correto', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEstacaoStub, 'validar')
    await sut.inserir(equipamentoFalso)
    expect(validarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar false caso o validaEstacao retorne false', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.inserir(equipamentoFalso)
    expect(resposta).toBeFalsy()
  })

  test('Deve retornar um erro caso o validaEstacao retorne um erro', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir(equipamentoFalso)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o RepositorioEquipamento com os valores corretos', async () => {
    const { sut, repositorioEquipamentoStub } = makeSut()
    const inserirSpy = jest.spyOn(repositorioEquipamentoStub, 'inserir')
    await sut.inserir(equipamentoFalso)
    expect(inserirSpy).toHaveBeenCalledWith(equipamentoFalso)
  })

  test('Deve retornar um erro se o RepositorioEquipamento retornar um erro', async () => {
    const { sut, repositorioEquipamentoStub } = makeSut()
    jest.spyOn(repositorioEquipamentoStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const inserir = sut.inserir(equipamentoFalso)
    await expect(inserir).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Equipamento cadastrado com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const inserir = await sut.inserir(equipamentoFalso)
    expect(inserir).toEqual('Equipamento cadastrado com sucesso')
  })
})
