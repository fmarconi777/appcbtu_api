import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { AlteraEstadoDeEquipamentoBD } from './altera-estado-de-equipamento-bd'

const equipamentoFalso = {
  id: '1',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: '1'
}

const dadosFalsos = {
  id: '1',
  estado: 'estado_qualquer'
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
  sut: AlteraEstadoDeEquipamentoBD
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
}

const makeSut = (): SubTipos => {
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamentoStub()
  const sut = new AlteraEstadoDeEquipamentoBD(repositorioConsultaEquipamentoStub)
  return {
    sut,
    repositorioConsultaEquipamentoStub
  }
}

describe('AlteraEstadoDeEquipamentoBD', () => {
  test('Deve chamar o repositorioConsultaEquipamentoStub com o valor correto', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(+dadosFalsos.id)
  })
})
