import { ValidadorBD } from '../../../apresentacao/protocolos/validadorBD'
import { DadosAlerta } from '../../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../../dominio/modelos/alerta'
import { RepositorioAlerta } from '../../protocolos/bd/alerta/repositorio-alerta'
import { CadastroDeAlerta } from './cadastro-de-alerta-bd'

const alertaFalso = {
  descricao: 'descricao_valido',
  prioridade: 'prioridade_valido',
  dataInicio: 'datainicio_valido',
  dataFim: 'datafim_valido',
  ativo: 'ativo_valido',
  estacaoId: '1'
}

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
        estacaoId: '1'
      }))
    }
  }
  return new RepositorioAlertaStub()
}

const makeValidadorDeEstacaoStub = (): ValidadorBD => {
  class ValidaEstacaoStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEstacaoStub()
}

interface SutTypes {
  sut: CadastroDeAlerta
  repositorioAlertaStub: RepositorioAlerta
  validadorDeEstacaoStub: ValidadorBD
}

const makeStu = (): SutTypes => {
  const validadorDeEstacaoStub = makeValidadorDeEstacaoStub()
  const repositorioAlertaStub = makeRepositorioAlerta()
  const sut = new CadastroDeAlerta(repositorioAlertaStub, validadorDeEstacaoStub)
  return {
    sut,
    repositorioAlertaStub,
    validadorDeEstacaoStub
  }
}

describe('Caso de uso CadastroDeAlerta', () => {
  test('Deve chamar o validadorDeEstacao com o valor correto', async () => {
    const { sut, validadorDeEstacaoStub } = makeStu()
    const validarSpy = jest.spyOn(validadorDeEstacaoStub, 'validar')
    await sut.inserir(alertaFalso)
    expect(validarSpy).toHaveBeenCalledWith(+alertaFalso.estacaoId)
  })

  test('Deve retornar um erro caso o validadorDeEstacao retorne um erro', async () => {
    const { sut, validadorDeEstacaoStub } = makeStu()
    jest.spyOn(validadorDeEstacaoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.inserir(alertaFalso)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar null caso o validadorDeEstacao retorne false', async () => {
    const { sut, validadorDeEstacaoStub } = makeStu()
    jest.spyOn(validadorDeEstacaoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.inserir(alertaFalso)
    expect(resposta).toBeNull()
  })

  test('Deve chamar o RepositorioAlerta com os valores corretos', async () => {
    const { sut, repositorioAlertaStub } = makeStu()
    const inserirSpy = jest.spyOn(repositorioAlertaStub, 'inserir')
    await sut.inserir(alertaFalso)
    expect(inserirSpy).toHaveBeenCalledWith(alertaFalso)
  })

  test('Deve retornar um erro se o RepositorioAlerta retornar um erro', async () => {
    const { sut, repositorioAlertaStub } = makeStu()
    jest.spyOn(repositorioAlertaStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const inserir = sut.inserir(alertaFalso)
    await expect(inserir).rejects.toThrow()
  })

  test('Deve retornar um alerta em caso de sucesso', async () => {
    const { sut } = makeStu()
    const inserir = await sut.inserir(alertaFalso)
    expect(inserir).toEqual({
      id: 'id_valido',
      descricao: 'descricao_valido',
      prioridade: 'prioridade_valido',
      dataInicio: 'datainicio_valido',
      dataFim: 'datafim_valido',
      ativo: 'ativo_valido',
      estacaoId: '1'
    })
  })
})
