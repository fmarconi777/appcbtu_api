import { ModeloArea } from '../../../dominio/modelos/area'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioInserirArea } from '../../protocolos/bd/area/repositorio-inserir-area'
import { CadastroDeAreaBD } from './cadastro-de-area-bd'

describe('CadastroDeAreaBD', () => {
  const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
    class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
      async consultarPorNome (nome: string): Promise<ModeloArea | null> {
        return await new Promise(resolve => resolve(null))
      }
    }
    return new ConsultaAreaPorNomeStub()
  }

  const makeAreaFalsa = (): ModeloArea => ({
    id: 'id_qualquer',
    nome: 'AREA_QUALQUER'
  })

  const makeRepositorioInserirArea = (): RepositorioInserirArea => {
    class RepositorioInserirAreaStub implements RepositorioInserirArea {
      async inserir (nome: string): Promise<ModeloArea> {
        return await new Promise(resolve => resolve(makeAreaFalsa()))
      }
    }
    return new RepositorioInserirAreaStub()
  }

  interface SubTipos {
    sut: CadastroDeAreaBD
    consultaAreaPorNomeStub: ConsultaAreaPorNome
    repositorioInserirAreaStub: RepositorioInserirArea
  }

  const makeSut = (): SubTipos => {
    const repositorioInserirAreaStub = makeRepositorioInserirArea()
    const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
    const sut = new CadastroDeAreaBD(consultaAreaPorNomeStub, repositorioInserirAreaStub)
    return {
      sut,
      consultaAreaPorNomeStub,
      repositorioInserirAreaStub
    }
  }

  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome')
    const area = 'AREA_QUALQUER'
    await sut.inserir(area)
    expect(consultarPorNomeSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar mensagem "área já cadstrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' })))
    const area = 'AREA_QUALQUER'
    const resposta = await sut.inserir(area)
    expect(resposta).toEqual('área já cadastrada')
  })

  test('Deve chamar o RepositorioInserirArea com o valor correto', async () => {
    const { sut, repositorioInserirAreaStub } = makeSut()
    const inserirSpy = jest.spyOn(repositorioInserirAreaStub, 'inserir')
    const area = 'AREA_QUALQUER'
    await sut.inserir(area)
    expect(inserirSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })
})
