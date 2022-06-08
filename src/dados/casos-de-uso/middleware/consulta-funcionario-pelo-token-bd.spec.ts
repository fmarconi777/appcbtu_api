import { ConsultaFuncionarioPeloTokenBd } from './consulta-funcionario-pelo-token-bd'
import { Decriptador } from '../../protocolos/criptografia/decriptador'
import { RepositorioConsultaFuncionarioPorId } from '../../protocolos/bd/repositorio-consulta-funcionario-por-id'
import { ModeloFuncionario } from '../funcionario/bd-adicionar-conta-protocolos'

const makeDecriptador = (): Decriptador => {
  class DecriptadorStub implements Decriptador {
    async decriptar (valor: string): Promise<string | null> {
      return await new Promise(resolve => resolve('id_qualquer'))
    }
  }
  return new DecriptadorStub()
}

const makeContaFalsa = (): ModeloFuncionario => ({
  id: 'id_valido',
  nome: 'nome_valido',
  email: 'email_valido',
  senha: 'hash_senha',
  administrador: 'false',
  areaId: 'area_valida'
})

const makeRepositorioConsultaFuncionarioPorId = (): RepositorioConsultaFuncionarioPorId => {
  class RepositorioConsultaFuncionarioPorIdStub implements RepositorioConsultaFuncionarioPorId {
    async consultarPorId (id: string, nivel?: string): Promise<ModeloFuncionario | null> {
      return await new Promise(resolve => resolve(makeContaFalsa()))
    }
  }
  return new RepositorioConsultaFuncionarioPorIdStub()
}

interface SubTipos {
  sut: ConsultaFuncionarioPeloTokenBd
  decriptadorStub: Decriptador
  repositorioConsultaFuncionarioPorIdStub: RepositorioConsultaFuncionarioPorId
}

const makeSut = (): SubTipos => {
  const repositorioConsultaFuncionarioPorIdStub = makeRepositorioConsultaFuncionarioPorId()
  const decriptadorStub = makeDecriptador()
  const sut = new ConsultaFuncionarioPeloTokenBd(decriptadorStub, repositorioConsultaFuncionarioPorIdStub)
  return {
    sut,
    decriptadorStub,
    repositorioConsultaFuncionarioPorIdStub
  }
}

describe('ConsultaFuncionarioPeloTokenBd', () => {
  test('Deve chamar o Decriptador com os valores corretos', async () => {
    const { sut, decriptadorStub } = makeSut()
    const decriptarSpy = jest.spyOn(decriptadorStub, 'decriptar')
    await sut.consultar('token_qualquer', 'nivel_qualquer')
    expect(decriptarSpy).toHaveBeenCalledWith('token_qualquer')
  })

  test('Deve retornar null se o Decriptador retornar null', async () => {
    const { sut, decriptadorStub } = makeSut()
    jest.spyOn(decriptadorStub, 'decriptar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const funcionario = await sut.consultar('token_qualquer', 'nivel_qualquer')
    expect(funcionario).toBeNull()
  })

  test('Deve chamar o RepositorioConsultaFuncionarioPorId com os valores corretos', async () => {
    const { sut, repositorioConsultaFuncionarioPorIdStub } = makeSut()
    const consultarPorIdSpy = jest.spyOn(repositorioConsultaFuncionarioPorIdStub, 'consultarPorId')
    await sut.consultar('id_qualquer', 'nivel_qualquer')
    expect(consultarPorIdSpy).toHaveBeenCalledWith('id_qualquer', 'nivel_qualquer')
  })

  test('Deve retornar null se o RepositorioConsultaFuncionarioPorId retornar null', async () => {
    const { sut, repositorioConsultaFuncionarioPorIdStub } = makeSut()
    jest.spyOn(repositorioConsultaFuncionarioPorIdStub, 'consultarPorId').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const funcionario = await sut.consultar('token_qualquer', 'nivel_qualquer')
    expect(funcionario).toBeNull()
  })
})
