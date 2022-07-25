import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { AlteraCadastroDeEquipamentoBD } from './altera-cadastro-de-equipamento-bd'

const dadosFalsos = {
  id: '1',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: '1'
}

const makeRepositorioAlteraCadastroDeEquipamentoStub = (): RepositorioAlteraCadastroDeEquipamento => {
  class RepositorioAlteraCadastroDeEquipamentoStub implements RepositorioAlteraCadastroDeEquipamento {
    async alterar (dadosEquipamento: ModeloEquipamento): Promise<string | null> {
      return await new Promise(resolve => resolve('Cadastro alterado com sucesso'))
    }
  }
  return new RepositorioAlteraCadastroDeEquipamentoStub()
}

const makeRepositorioConsultaEquipamento = (): RepositorioConsultaEquipamento => {
  class RepositorioConsultaEquipamentoStub implements RepositorioConsultaEquipamento {
    async consultar (id?: number): Promise<ModeloEquipamento | ModeloEquipamento[] | null> {
      if (id) { // eslint-disable-line
        return await new Promise(resolve => resolve(dadosFalsos))
      }
      return await new Promise(resolve => resolve([dadosFalsos]))
    }
  }
  return new RepositorioConsultaEquipamentoStub()
}

interface SubTipos {
  sut: AlteraCadastroDeEquipamentoBD
  repositorioAlteraCadastroDeEquipamentoStub: RepositorioAlteraCadastroDeEquipamento
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
}

const makeSut = (): SubTipos => {
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamento()
  const repositorioAlteraCadastroDeEquipamentoStub = makeRepositorioAlteraCadastroDeEquipamentoStub()
  const sut = new AlteraCadastroDeEquipamentoBD(repositorioAlteraCadastroDeEquipamentoStub, repositorioConsultaEquipamentoStub)
  return {
    sut,
    repositorioAlteraCadastroDeEquipamentoStub,
    repositorioConsultaEquipamentoStub
  }
}

describe('AlteraCadastroDeEquipamentoBD', () => {
  test('Deve chamar o repositorioConsultaEquipamentoStub com o valor correto', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(+dadosFalsos.id)
  })

  test('Deve retornar um erro caso o repositorioConsultaEquipamentoStub retorne um erro', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dadosFalsos)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o repositorioAlteraCadastroDeEquipamentoStub com os valores corretos', async () => {
    const { sut, repositorioAlteraCadastroDeEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraCadastroDeEquipamentoStub, 'alterar')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(dadosFalsos)
  })
})
