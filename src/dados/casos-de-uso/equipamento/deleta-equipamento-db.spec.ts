import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { DeletaEquipamentoDB } from './deleta-equipamento-db'

const equipamentoFalso = {
  id: '1',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: '1'
}

const makeRepositorioConsultaEquipamentoStub = (): RepositorioConsultaEquipamento => {
  class RepositorioConsultaEquipamentoStub implements RepositorioConsultaEquipamento {
    async consultar (id?: number): Promise<ModeloEquipamento | ModeloEquipamento[] | null> {
      if (id) { // eslint-disable-line
        return await new Promise(resolve => resolve(equipamentoFalso))
      }
      return await new Promise(resolve => resolve([equipamentoFalso]))
    }
  }
  return new RepositorioConsultaEquipamentoStub()
}

interface SubTipos {
  sut: DeletaEquipamentoDB
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
}

const id = 1

const makeSut = (): SubTipos => {
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamentoStub()
  const sut = new DeletaEquipamentoDB(repositorioConsultaEquipamentoStub)
  return {
    sut,
    repositorioConsultaEquipamentoStub
  }
}

describe('DeletaEquipamentoDB', () => {
  test('Deve chamar o repositorioConsultaEquipamentoStub com o valor correto', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar')
    await sut.deletar(id)
    expect(alterarSpy).toHaveBeenCalledWith(id)
  })

  test('Deve retornar um erro caso o repositorioConsultaEquipamentoStub retorne um erro', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.deletar(id)
    await expect(resposta).rejects.toThrow()
  })
})
