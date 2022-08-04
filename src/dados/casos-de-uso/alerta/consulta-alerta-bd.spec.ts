import { ConsultaAlertaBD } from './consulta-alerta-bd'
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
    async consultaalerta (sigla?: string, id?: number): Promise<ModelosAlertas> {
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
  test('Deve chamar o RepositorioConsultaAlerta com o valor correto caso somente a sigla seja fornecida', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    const consultarSpy = jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta')
    const sigla = 'sigla_qualquer'
    await sut.consultaalerta(sigla)
    expect(consultarSpy).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Método consultaralerta deve retornar um erro caso o RepositorioConsultaAlerta retorne um erro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const sigla = 'sigla_qualquer'
    const respostaConsultar = sut.consultaalerta(sigla)
    await expect(respostaConsultar).rejects.toThrow()
  })

  test('Deve retornar um array de alertas caso somente a sigla seja fornecida', async () => {
    const { sut } = makeSut()
    const alerta = 'sigla_qualquer'
    const resposta = await sut.consultaalerta(alerta)
    expect(resposta).toEqual([makeAlertaFalsa()])
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

  test('Método consultaralerta deve retornar null caso o RepositorioConsultaAlerta não encontre um alerta para o parametro', async () => {
    const { sut, repositorioAlertaConsultaStub } = makeSut()
    jest.spyOn(repositorioAlertaConsultaStub, 'consultaalerta').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const alerta = 'sigla_qualquer'
    const respostaConsultar = await sut.consultaalerta(alerta)
    expect(respostaConsultar).toBeNull()
  })
})
