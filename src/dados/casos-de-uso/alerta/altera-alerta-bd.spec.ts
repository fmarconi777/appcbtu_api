import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { ConsultaAlertaPorId } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-por-id'
import { AlteraAlertaBD } from './altera-alerta-bd'

const dados: ModeloAlerta = {
  id: '1',
  descricao: 'qualquer_descricao',
  prioridade: 'qualquer_prioridade',
  dataInicio: 'inicio_qualquer',
  dataFim: 'fim_qualquer',
  ativo: 'true',
  estacaoId: '1'
}

const makeConsultaAlertaPorIdStub = (): ConsultaAlertaPorId => {
  class ConsultaAlertaPorIdStub implements ConsultaAlertaPorId {
    async consultarPorId (id: number): Promise<ModeloAlerta | null> {
      return dados
    }
  }
  return new ConsultaAlertaPorIdStub()
}

interface SubTipos {
  sut: AlteraAlertaBD
  consultaAlertaPorIdStub: ConsultaAlertaPorId
}

const makeSut = (): SubTipos => {
  const consultaAlertaPorIdStub = makeConsultaAlertaPorIdStub()
  const sut = new AlteraAlertaBD(consultaAlertaPorIdStub)
  return {
    sut,
    consultaAlertaPorIdStub
  }
}

describe('AlteraAlertaBD', () => {
  test('Deve chamar o consultaAlertaPorId com o parametro correto', async () => {
    const { sut, consultaAlertaPorIdStub } = makeSut()
    const consultarPorIdSpy = jest.spyOn(consultaAlertaPorIdStub, 'consultarPorId')
    await sut.alterar(dados)
    expect(consultarPorIdSpy).toHaveBeenCalledWith(+dados.id)
  })

  test('Deve retornar um erro caso o consultaAlertaPorId retorne um erro', async () => {
    const { sut, consultaAlertaPorIdStub } = makeSut()
    jest.spyOn(consultaAlertaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dados)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o consultaAlertaPorId retorne null', async () => {
    const { sut, consultaAlertaPorIdStub } = makeSut()
    jest.spyOn(consultaAlertaPorIdStub, 'consultarPorId').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.alterar(dados)
    expect(resposta).toBeNull()
  })
})
