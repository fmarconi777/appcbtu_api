import { InserirModeloEquipamento } from '../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioEquipamento } from '../../protocolos/repositorio-equipamento'
import { CadastroDeEquipamentoBd } from './cadastro-de-equipamento-bd'

const makeRepositorioEquimento = (): RepositorioEquipamento => {
  class RepositorioEquipamentoStub implements RepositorioEquipamento {
    async inserir (inserirModeloEquipamento: InserirModeloEquipamento): Promise<ModeloEquipamento> {
      return await new Promise(resolve => resolve({
        id: 'id_valida',
        nome: 'nome_valido',
        tipo: 'tipo_valido',
        num_falha: 'num_falha_valido',
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
      num_falha: 'num_falha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    }
    await sut.inserir(equipamentoFalso)
    expect(inserirSpy).toHaveBeenCalledWith(equipamentoFalso)
  })
})
