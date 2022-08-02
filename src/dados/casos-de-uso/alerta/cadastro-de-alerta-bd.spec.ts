import { DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlerta } from '../../protocolos/bd/alerta/repositorio-alerta'
import { CadastroDeAlerta } from './cadastro-de-alerta-bd'

const makeRepositorioAlerta = (): RepositorioAlerta => {
  class RepositorioAlertaStub implements RepositorioAlerta {
    async inserir (dadosAlerta: DadosAlerta): Promise<ModeloAlerta> {
      return await new Promise(resolve => resolve({
        id: 'id_valido',
        descricao: 'descricao_valido',
        prioridade: 'prioridade_valido',
        dataInicio: 'datainicio_valido',
        dataFim: 'datafim_valido',
        ativo: 'ativo_valido',
        estacaoId: 'estacaoid_valido'
      }))
    }
  }
  return new RepositorioAlertaStub()
}

interface SutTypes {
  sut: CadastroDeAlerta
  repositorioAlertaStub: RepositorioAlerta
}

const makeStu = (): SutTypes => {
  const repositorioAlertaStub = makeRepositorioAlerta()
  const sut = new CadastroDeAlerta(repositorioAlertaStub)
  return {
    sut,
    repositorioAlertaStub
  }
}

describe('Caso de uso CadastroDeAlerta', () => {
  test('Deve chamar o RepositorioAlerta com os valores corretos', async () => {
    const { sut, repositorioAlertaStub } = makeStu()
    const inserirSpy = jest.spyOn(repositorioAlertaStub, 'inserir')
    const alertaFalso = {
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: 'estacaoid_valido'
    }
    await sut.inserir(alertaFalso)
    expect(inserirSpy).toHaveBeenCalledWith(alertaFalso)
  })
  test('Deve retornar um erro se o RepositorioAlerta retornar um erro', async () => {
    const { sut, repositorioAlertaStub } = makeStu()
    jest.spyOn(repositorioAlertaStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const alertaFalso = {
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: 'estacaoid_valido'
    }
    const inserir = sut.inserir(alertaFalso)
    await expect(inserir).rejects.toThrow()
  })
  test('Deve retornar um alerta em caso de sucesso', async () => {
    const { sut } = makeStu()
    const alertaFalso = {
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: 'estacaoid_valido'
    }
    const inserir = await sut.inserir(alertaFalso)
    expect(inserir).toEqual({
      id: 'id_valido',
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: 'estacaoid_valido'
    })
  })
})
