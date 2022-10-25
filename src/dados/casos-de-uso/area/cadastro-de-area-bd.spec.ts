import { CadastroDeAreaBD } from './cadastro-de-area-bd'
import { ModeloArea } from '@/dominio/modelos/area'
import { ConsultaAreaPorId } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-id'
import { ConsultaAreaPorNome } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioInserirArea } from '@/dados/protocolos/bd/area/repositorio-inserir-area'

describe('CadastroDeAreaBD', () => {
  const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
    class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
      async consultarPorNome (nome: string): Promise<ModeloArea | null> {
        return await new Promise(resolve => resolve(null))
      }
    }
    return new ConsultaAreaPorNomeStub()
  }

  const makeConsultaAreaPorIdStub = (): ConsultaAreaPorId => {
    class ConsultaAreaPorIdStub implements ConsultaAreaPorId {
      async consultarPorId (id: number): Promise<ModeloArea | null> {
        return await new Promise(resolve => resolve(null))
      }
    }
    return new ConsultaAreaPorIdStub()
  }

  const makeAreaFalsa = (): ModeloArea => ({
    id: 'id_qualquer',
    nome: 'AREA_QUALQUER'
  })

  const makeRepositorioInserirArea = (): RepositorioInserirArea => {
    class RepositorioInserirAreaStub implements RepositorioInserirArea {
      async inserir (id: number, nome: string): Promise<ModeloArea> {
        return await new Promise(resolve => resolve(makeAreaFalsa()))
      }
    }
    return new RepositorioInserirAreaStub()
  }

  interface SubTipos {
    sut: CadastroDeAreaBD
    consultaAreaPorNomeStub: ConsultaAreaPorNome
    consultaAreaPorIdStub: ConsultaAreaPorId
    repositorioInserirAreaStub: RepositorioInserirArea
  }

  const makeSut = (): SubTipos => {
    const repositorioInserirAreaStub = makeRepositorioInserirArea()
    const consultaAreaPorIdStub = makeConsultaAreaPorIdStub()
    const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
    const sut = new CadastroDeAreaBD(consultaAreaPorNomeStub, consultaAreaPorIdStub, repositorioInserirAreaStub)
    return {
      sut,
      consultaAreaPorNomeStub,
      consultaAreaPorIdStub,
      repositorioInserirAreaStub
    }
  }

  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome')
    await sut.inserir('AREA_QUALQUER', 1)
    expect(consultarPorNomeSpy).toHaveBeenCalledWith('AREA_QUALQUER')
  })

  test('Deve retornar mensagem "área já cadastrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(Promise.resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' }))
    const resposta = await sut.inserir('AREA_QUALQUER', 1)
    expect(resposta).toEqual('área já cadastrada')
  })

  test('Deve retornar um erro caso o consultaAreaPorNome retorne um erro', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir('AREA_QUALQUER', 1)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o consultaAreaPorId com o valor correto', async () => {
    const { sut, consultaAreaPorIdStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorIdStub, 'consultarPorId')
    await sut.inserir('AREA_QUALQUER', 1)
    expect(consultarPorNomeSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar um erro caso o consultaAreaPorId retorne um erro', async () => {
    const { sut, consultaAreaPorIdStub } = makeSut()
    jest.spyOn(consultaAreaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir('AREA_QUALQUER', 1)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar mensagem "id já cadastrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorIdStub } = makeSut()
    jest.spyOn(consultaAreaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' }))
    const resposta = await sut.inserir('AREA_QUALQUER', 1)
    expect(resposta).toEqual('id já cadastrada')
  })

  test('Deve chamar o RepositorioInserirArea com o valor correto', async () => {
    const { sut, repositorioInserirAreaStub } = makeSut()
    const inserirSpy = jest.spyOn(repositorioInserirAreaStub, 'inserir')
    await sut.inserir('AREA_QUALQUER', 1)
    expect(inserirSpy).toHaveBeenCalledWith(1, 'AREA_QUALQUER')
  })

  test('Deve retornar um erro caso o RepositorioInserirArea retorne um erro', async () => {
    const { sut, repositorioInserirAreaStub } = makeSut()
    jest.spyOn(repositorioInserirAreaStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const resposta = sut.inserir('AREA_QUALQUER', 1)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar uma área em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.inserir('AREA_QUALQUER', 1)
    expect(resposta).toEqual(makeAreaFalsa())
  })
})
