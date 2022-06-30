import { ConsultaAlertaBD } from './consulta-alerta'
import { RepositorioConsultaAlerta, ModelosAlertas } from '../../protocolos/bd/alerta/repositorio-consulta-alerta-todas'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'

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
    async consultaalerta (parametro?: string): Promise<ModelosAlertas> {
      if (parametro) { //eslint-disable-line
        return await new Promise(resolve => resolve(makeAlertaFalsa()))
      }
      return await new Promise(resolve => resolve([makeAlertaFalsa()]))
    }
  }
  return new RepositorioConsultaAlertaStub()
}
interface SubTipo {
  sut: ConsultaAlertaBD
  repositorioAlertaConsultaStub: RepositorioConsultaAlerta
}
const makeSut = (): SubTipo => {
  const repositorioAlertaConsultaStub = makeRepositorioAlerta()
  const sut = new ConsultaAlertaBD(repositorioAlertaConsultaStub)
  return {
    sut,
    repositorioAlertaConsultaStub
  }
}

describe('ConsultaAlerta', () => {
  test('Deve chamar o RepositorioConsultaAlerta com o valor correto', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta')
    const alerta = 'ALERTA_QUALQUER'
    await sut.consultaalerta(alerta)
    expect(consultarSpy).toHaveBeenCalledWith('ALERTA_QUALQUER')
  })

  test('Método consultaralerta deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const alerta = 'ALERTA_QUALQUER'
    const respostaConsultar = sut.consultaalerta(alerta)
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Método consultaalertaTodas deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const respostaConsultar = sut.consultaalertaTodas()
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Deve Retornar um array com todos os alertas caso um parâmetro não seja fornecido', async () => {
    const { sut } = makeSut()
    const resposta = await sut.consultaalertaTodas()
    expect(resposta).toEqual([makeAlertaFalsa()])
  })

  test('Deve retornar um alerta caso um parâmetro seja fornecido', async () => {
    const { sut } = makeSut()
    const alerta = 'ALERTA_QUALQUER'
    const resposta = await sut.consultaalerta(alerta)
    expect(resposta).toEqual(makeAlertaFalsa())
  })
})
