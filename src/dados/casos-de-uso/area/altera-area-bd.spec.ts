import { AlteraAreaBD } from './altera-area-bd'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'
import { ModeloArea } from '../../../dominio/modelos/area'

const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
  class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
    async consultarPorNome (nome: string): Promise<ModeloArea | null> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new ConsultaAreaPorNomeStub()
}

interface SubTipos {
  sut: AlteraAreaBD
  consultaAreaPorNomeStub: ConsultaAreaPorNome
}

const makeSut = (): SubTipos => {
  const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
  const sut = new AlteraAreaBD(consultaAreaPorNomeStub)
  return {
    sut,
    consultaAreaPorNomeStub
  }
}

describe('AlteraAreaBD', () => {
  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome')
    await sut.alterar('NOME_QULAQUER')
    expect(consultarPorNomeSpy).toHaveBeenCalledWith('NOME_QULAQUER')
  })
})
