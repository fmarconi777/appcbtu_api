import { DadosEquipamento } from '../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioEquipamento } from '../../protocolos/bd/equipamento/repositorio-equipamento'
import { CadastroDeEquipamentoBd } from './cadastro-de-equipamento-bd'

const makeRepositorioEquimento = (): RepositorioEquipamento => {
  class RepositorioEquipamentoStub implements RepositorioEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
      return await new Promise(resolve => resolve({
        id: 'id_valida',
        nome: 'nome_valido',
        tipo: 'tipo_valido',
        numFalha: 'numFalha_valido',
        estado: 'estado_valido',
        estacaoId: 'estacaoId_valido'
      }))
    }
  }
  return new RepositorioEquipamentoStub()
}

interface SutTypes {
  sut: CadastroDeEquipamentoBd
  repositorioEquipamentoStub: RepositorioEquipamento
}

const makeStu = (): SutTypes => {
  const repositorioEquipamentoStub = makeRepositorioEquimento()
  const sut = new CadastroDeEquipamentoBd(repositorioEquipamentoStub)
  return {
    sut,
    repositorioEquipamentoStub
  }
}

describe('Caso de uso CadastroDeEquipamentoBd', () => {
  test('Deve chamar o RepositorioEquipamento com os valores corretos', async () => {
    const { sut, repositorioEquipamentoStub } = makeStu()
    const inserirSpy = jest.spyOn(repositorioEquipamentoStub, 'inserir')
    const equipamentoFalso = {
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    }
    await sut.inserir(equipamentoFalso)
    expect(inserirSpy).toHaveBeenCalledWith(equipamentoFalso)
  })
  test('Deve retornar um erro se o RepositorioEquipamento retornar um erro', async () => {
    const { sut, repositorioEquipamentoStub } = makeStu()
    jest.spyOn(repositorioEquipamentoStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const equipamentoFalso = {
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    }
    const inserir = sut.inserir(equipamentoFalso)
    await expect(inserir).rejects.toThrow()
  })
  test('Deve retornar um equipamento em caso de sucesso', async () => {
    const { sut } = makeStu()
    const equipamentoFalso = {
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    }
    const inserir = await sut.inserir(equipamentoFalso)
    expect(inserir).toEqual({
      id: 'id_valida',
      nome: 'nome_valido',
      tipo: 'tipo_valido',
      numFalha: 'numFalha_valido',
      estado: 'estado_valido',
      estacaoId: 'estacaoId_valido'
    })
  })
})
