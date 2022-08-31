import { ModeloFuncionario } from '../../../../dominio/modelos/funcionario'
import { ConsultaFuncionarioPorNome } from '../../../protocolos/bd/funcionario/repositorio-consulta-funcionario-por-nome'
import { ConsultaAdministradorBD } from './consulta-administrador'

const makeRepositorioConsultaFuncionarioPorNomeStub = (): ConsultaFuncionarioPorNome => {
  class RepositorioConsultaFuncionarioPorNomeStub implements ConsultaFuncionarioPorNome {
    async consultarPorNome (nome: string): Promise<ModeloFuncionario | null> {
      return await Promise.resolve({
        id: 'id_qualquer',
        nome: 'nome_qualquer',
        email: 'email_qualquer',
        senha: 'senha_qualquer',
        administrador: 'true',
        areaId: 'area_qualquer'
      })
    }
  }
  return new RepositorioConsultaFuncionarioPorNomeStub()
}

interface SubTipos {
  sut: ConsultaAdministradorBD
  repositorioConsultaFuncionarioPorNomeStub: ConsultaFuncionarioPorNome
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorNomeStub = makeRepositorioConsultaFuncionarioPorNomeStub()
  const sut = new ConsultaAdministradorBD(repositorioConsultaFuncionarioPorNomeStub)
  return {
    sut,
    repositorioConsultaFuncionarioPorNomeStub
  }
}

describe('Consulta Administrador', () => {
  test('Deve chamar o repositorioConsultaFuncionarioPorNome com o valor correto', async () => {
    const { sut, repositorioConsultaFuncionarioPorNomeStub } = makeSut()
    const consultaPorNomeSpy = jest.spyOn(repositorioConsultaFuncionarioPorNomeStub, 'consultarPorNome')
    await sut.consultar()
    expect(consultaPorNomeSpy).toHaveBeenCalledWith('admin')
  })

  test('Deve retornar um erro caso o repositorioConsultaFuncionarioPorNome retorne um erro', async () => {
    const { sut, repositorioConsultaFuncionarioPorNomeStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorNomeStub, 'consultarPorNome').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.consultar()
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar false caso o repositorioConsultaFuncionarioPorNome retorne null', async () => {
    const { sut, repositorioConsultaFuncionarioPorNomeStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorNomeStub, 'consultarPorNome').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.consultar()
    expect(resposta).toBeFalsy()
  })

  test('Deve retornar true em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultar()
    expect(resposta).toBeTruthy()
  })
})
