import { AlteraAreaBD } from './altera-area-bd'
import { ConsultaAreaPorNome } from '../../protocolos/bd/area/repositorio-consulta-area-por-nome'
import { ModeloArea } from '../../../dominio/modelos/area'
import { RepositorioAlteraArea } from '../../protocolos/bd/area/repositorio-altera-area'

const makeConsultaAreaPorNome = (): ConsultaAreaPorNome => {
  class ConsultaAreaPorNomeStub implements ConsultaAreaPorNome {
    async consultarPorNome (nome: string): Promise<ModeloArea | null> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new ConsultaAreaPorNomeStub()
}

const makeRepositorioAlteraAreaStub = (): RepositorioAlteraArea => {
  class RepositorioAlteraAreaStub implements RepositorioAlteraArea {
    async alterar (nome: string): Promise<string> {
      return await new Promise(resolve => resolve('Área alterada com sucesso'))
    }
  }
  return new RepositorioAlteraAreaStub()
}

interface SubTipos {
  sut: AlteraAreaBD
  consultaAreaPorNomeStub: ConsultaAreaPorNome
  repositorioAlteraAreaStub: RepositorioAlteraArea
}

const makeSut = (): SubTipos => {
  const repositorioAlteraAreaStub = makeRepositorioAlteraAreaStub()
  const consultaAreaPorNomeStub = makeConsultaAreaPorNome()
  const sut = new AlteraAreaBD(consultaAreaPorNomeStub, repositorioAlteraAreaStub)
  return {
    sut,
    consultaAreaPorNomeStub,
    repositorioAlteraAreaStub
  }
}

describe('AlteraAreaBD', () => {
  test('Deve chamar o consultaAreaPorNome com o valor correto', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    const consultarPorNomeSpy = jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome')
    await sut.alterar('NOME_QULAQUER')
    expect(consultarPorNomeSpy).toHaveBeenCalledWith('NOME_QULAQUER')
  })

  test('Deve retornar a mensagem "área já cadastrada" caso a área já exista no banco de dados', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'id_qualquer', nome: 'AREA_QUALQUER' })))
    const resposta = await sut.alterar('AREA_QUALQUER')
    expect(resposta).toEqual('área já cadastrada')
  })

  test('Deve retornar um erro caso consultaAreaPorNome retorne um erro', async () => {
    const { sut, consultaAreaPorNomeStub } = makeSut()
    jest.spyOn(consultaAreaPorNomeStub, 'consultarPorNome').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const resposta = sut.alterar('AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o RepositorioAlteraArea com o valor correto', async () => {
    const { sut, repositorioAlteraAreaStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraAreaStub, 'alterar')
    await sut.alterar('NOME_QULAQUER')
    expect(alterarSpy).toHaveBeenCalledWith('NOME_QULAQUER')
  })

  test('Deve retornar um erro caso RepositorioAlteraArea retorne um erro', async () => {
    const { sut, repositorioAlteraAreaStub } = makeSut()
    jest.spyOn(repositorioAlteraAreaStub, 'alterar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const resposta = sut.alterar('AREA_QUALQUER')
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar a mensagem "Área alterada com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.alterar('NOME_QULAQUER')
    expect(resposta).toEqual('Área alterada com sucesso')
  })
})
