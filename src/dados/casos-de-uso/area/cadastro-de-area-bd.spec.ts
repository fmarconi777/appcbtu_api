import { ModeloArea } from '../../../dominio/modelos/area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'
import { CadastroDeAreaBD } from './cadastro-de-area-bd'

describe('CadastroDeAreaBD', () => {
  const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
    class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
      async consultaPorNome (nome: string): Promise<ModeloArea | null> {
        return await new Promise(resolve => resolve(null))
      }
    }
    return new ConsultaAreaPorNomeStub()
  }

  interface SubTipos {
    sut: CadastroDeAreaBD
    consultaAreaPorNomeStub: ConsultaAreaPorNome
  }

  const makeSut = (): SubTipos => {
    const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
    const sut = new CadastroDeAreaBD(consultaAreaPorNomeStub)
    return {
      sut,
      consultaAreaPorNomeStub
    }
  }

  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultaPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultaPorNome')
    const area = 'AREA_QUALQUER'
    await sut.inserir(area)
    expect(consultaPorNomeSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar mensagem "área já cadstrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultaPorNome').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' })))
    const area = 'AREA_QUALQUER'
    const resposta = await sut.inserir(area)
    expect(resposta).toEqual('área já cadastrada')
  })
})
