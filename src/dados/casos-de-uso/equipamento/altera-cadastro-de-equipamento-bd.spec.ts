import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { AlteraCadastroDeEquipamentoBD } from './altera-cadastro-de-equipamento-bd'

const dadosFalsos = {
  id: 'id_qualquer',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: 'estacaoId_qualquer'
}

const makeRepositorioAlteraCadastroDeEquipamentoStub = (): RepositorioAlteraCadastroDeEquipamento => {
  class RepositorioAlteraCadastroDeEquipamentoStub implements RepositorioAlteraCadastroDeEquipamento {
    async alterar (dadosEquipamento: ModeloEquipamento): Promise<string> {
      return await new Promise(resolve => resolve('Cadastro alterado com sucesso'))
    }
  }
  return new RepositorioAlteraCadastroDeEquipamentoStub()
}

interface SubTipos {
  sut: AlteraCadastroDeEquipamentoBD
  repositorioAlteraCadastroDeEquipamentoStub: RepositorioAlteraCadastroDeEquipamento
}

const makeSut = (): SubTipos => {
  const repositorioAlteraCadastroDeEquipamentoStub = makeRepositorioAlteraCadastroDeEquipamentoStub()
  const sut = new AlteraCadastroDeEquipamentoBD(repositorioAlteraCadastroDeEquipamentoStub)
  return {
    sut,
    repositorioAlteraCadastroDeEquipamentoStub
  }
}

describe('AlteraCadastroDeEquipamentoBD', () => {
  test('Deve chamar o repositorioAlteraCadastroDeEquipamentoStub com os valores corretos', async () => {
    const { sut, repositorioAlteraCadastroDeEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraCadastroDeEquipamentoStub, 'alterar')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(dadosFalsos)
  })
})
