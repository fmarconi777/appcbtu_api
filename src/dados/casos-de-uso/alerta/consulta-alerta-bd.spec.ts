import { ConsultaAlertaBD } from './consulta-alerta-bd'
import { RepositorioConsultaAlerta, ModelosAlertas } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlertaConsultaPorId } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-por-id'

const makeAlertaFalsa = (): ModeloAlerta => ({
  id: 'id_qualquer',
  descricao: 'descricao_qualquer',
  prioridade: 'prioridade_qualquer',
  ativo: 'ativo_qualquer',
  dataInicio: 'dataInicio_qualquer',
  dataFim: 'dataFim_qualquer',
  estacaoId: 'estacaoId_qualquer'
})

const makeRepositorioAlerta = (): RepositorioConsultaAlerta => {
  class RepositorioConsultaAlertaStub implements RepositorioConsultaAlerta {
    async consultar (sigla?: string, id?: number): Promise<ModelosAlertas> {
      if (sigla) { //eslint-disable-line
        if (id) { //eslint-disable-line
          return await new Promise(resolve => resolve(makeAlertaFalsa()))
        }
        return await new Promise(resolve => resolve([makeAlertaFalsa()]))
      }
      return await new Promise(resolve => resolve([makeAlertaFalsa()]))
    }
  }
  return new RepositorioConsultaAlertaStub()
}

const makeRepositorioAlertaConsultaPorIdStub = (): RepositorioAlertaConsultaPorId => {
  class RepositorioAlertaConsultaPorIdStub implements RepositorioAlertaConsultaPorId {
    async consultarPorId (id: number): Promise<ModeloAlerta | null> {
      return await Promise.resolve(makeAlertaFalsa())
    }
  }
  return new RepositorioAlertaConsultaPorIdStub()
}

interface SubTipo {
  sut: ConsultaAlertaBD
  repositorioAlertaConsultaStub: RepositorioConsultaAlerta
  repositorioAlertaConsultaPorIdStub: RepositorioAlertaConsultaPorId
}

const makeSut = (): SubTipo => {
  const repositorioAlertaConsultaPorIdStub = makeRepositorioAlertaConsultaPorIdStub()
  const repositorioAlertaConsultaStub = makeRepositorioAlerta()
  const sut = new ConsultaAlertaBD(repositorioAlertaConsultaStub, repositorioAlertaConsultaPorIdStub)
  return {
    sut,
    repositorioAlertaConsultaStub,
    repositorioAlertaConsultaPorIdStub
  }
}

describe('ConsultaAlerta', () => {
  test('Deve chamar o RepositorioConsultaAlerta com o valor correto caso somente a sigla seja fornecida', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAlertaConsultaStub, 'consultar')
    const sigla = 'sigla_qualquer'
    await sut.consultar(sigla)
    expect(consultarSpy).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Método consultaralerta deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const sigla = 'sigla_qualquer'
    const respostaConsultar = sut.consultar(sigla)
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Deve retornar um array de alertas caso somente a sigla seja fornecida', async () => {
    const { sut } = makeSut()
    const alerta = 'sigla_qualquer'
    const resposta = await sut.consultar(alerta)
    expect(resposta).toEqual([makeAlertaFalsa()])
  })

  test('Deve chamar o RepositorioConsultaAlertaPorId com o valor correto caso um id seja fornecido', async () => {
    const { sut, repositorioAlertaConsultaPorIdStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAlertaConsultaPorIdStub, 'consultarPorId')
    const sigla = 'sigla_qualquer'
    const id = '1'
    await sut.consultar(sigla, +id)
    expect(consultarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar null caso o RepositorioConsultaAlertaPorId retorne null', async () => {
    const { sut, repositorioAlertaConsultaPorIdStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.resolve(null))
    const sigla = 'sigla_qualquer'
    const id = '1'
    const resposta = await sut.consultar(sigla, +id)
    expect(resposta).toBeNull()
  })

  test('Deve retornar um erro caso o RepositorioConsultaAlertaPorId retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaPorIdStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.reject(new Error()))
    const sigla = 'sigla_qualquer'
    const id = '1'
    const resposta = sut.consultar(sigla, +id)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve chamar o RepositorioConsultaAlerta com os valores corretos caso uma sigla e um id sejam fornecidos', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAlertaConsultaStub, 'consultar')
    const sigla = 'sigla_qualquer'
    const id = '1'
    await sut.consultar(sigla, +id)
    expect(consultarSpy).toHaveBeenCalledWith(sigla, +id)
  })

  test('Método consultaAlertaTodas deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultar').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const respostaConsultar = sut.consultarTodas()
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Deve Retornar um array com todos os alertas caso um parâmetro não seja fornecido', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultarTodas()
    expect(resposta).toEqual([makeAlertaFalsa()])
  })

  test('Método consultaralerta deve retornar null caso o RepositorioConsultaAlerta não encontre um alerta para o parametro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultar').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const alerta = 'sigla_qualquer'
    const respostaConsultar = await sut.consultar(alerta)
    expect(respostaConsultar).toBeNull()
  })
})