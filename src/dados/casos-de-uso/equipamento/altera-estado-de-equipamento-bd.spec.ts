import { EstadoEquipamento } from '../../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'
import { ModeloEquipamento } from '../../../dominio/modelos/equipamento'
import { RepositorioAlteraEstadoDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-estado-de-equipamento'
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

const makeRepositorioAlteraEstadoDeEquipamentoStub = (): RepositorioAlteraEstadoDeEquipamento => {
  class RepositorioAlteraEstadoDeEquipamentoStub implements RepositorioAlteraEstadoDeEquipamento {
    async alterarEstado (dadosEquipamento: EstadoEquipamento): Promise<string> {
      return await new Promise(resolve => resolve('Cadastro alterado com sucesso'))
    }
  }
  return new RepositorioAlteraEstadoDeEquipamentoStub()
}

interface SubTipos {
  sut: AlteraEstadoDeEquipamentoBD
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
  repositorioAlteraEstadoDeEquipamentoStub: RepositorioAlteraEstadoDeEquipamento
}

const makeSut = (): SubTipos => {
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamentoStub()
  const repositorioAlteraEstadoDeEquipamentoStub = makeRepositorioAlteraEstadoDeEquipamentoStub()
  const sut = new AlteraEstadoDeEquipamentoBD(repositorioConsultaEquipamentoStub, repositorioAlteraEstadoDeEquipamentoStub)
  return {
    sut,
    repositorioConsultaEquipamentoStub,
    repositorioAlteraEstadoDeEquipamentoStub
  }
}

describe('AlteraEstadoDeEquipamentoBD', () => {
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

  test('Deve retornar null caso o repositorioConsultaEquipamentoStub retorne null', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.alterar(dadosFalsos)
    expect(resposta).toBeNull()
  })

  test('Deve chamar o repositorioAlteraEstadoDeEquipamentoStub com o valor correto', async () => {
    const { sut, repositorioAlteraEstadoDeEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraEstadoDeEquipamentoStub, 'alterarEstado')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(dadosFalsos)
  })

  test('Deve retornar um erro caso o repositorioAlteraEstadoDeEquipamentoStub retorne um erro', async () => {
    const { sut, repositorioAlteraEstadoDeEquipamentoStub } = makeSut()
    jest.spyOn(repositorioAlteraEstadoDeEquipamentoStub, 'alterarEstado').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dadosFalsos)
    await expect(resposta).rejects.toThrow()
  })
})
