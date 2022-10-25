import { AlteraCadastroDeEquipamentoBD } from './altera-cadastro-de-equipamento-bd'
import { ModeloEquipamento } from '@/dominio/modelos/equipamento'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'
import { RepositorioAlteraCadastroDeEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { RepositorioConsultaEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-consulta-equipamento'

const dadosFalsos = {
  id: '1',
  nome: 'nome_qualquer',
  tipo: 'tipo_qualquer',
  estado: 'estado_qualquer',
  estacaoId: '1'
}

const makeRepositorioAlteraCadastroDeEquipamentoStub = (): RepositorioAlteraCadastroDeEquipamento => {
  class RepositorioAlteraCadastroDeEquipamentoStub implements RepositorioAlteraCadastroDeEquipamento {
    async alterar (dadosEquipamento: ModeloEquipamento): Promise<string> {
      return await new Promise(resolve => resolve('Cadastro alterado com sucesso'))
    }
  }
  return new RepositorioAlteraCadastroDeEquipamentoStub()
}

const makeRepositorioConsultaEquipamento = (): RepositorioConsultaEquipamento => {
  class RepositorioConsultaEquipamentoStub implements RepositorioConsultaEquipamento {
    async consultar (id?: number): Promise<ModeloEquipamento | ModeloEquipamento[] | null> {
      if (id) { // eslint-disable-line
        return await new Promise(resolve => resolve(dadosFalsos))
      }
      return await new Promise(resolve => resolve([dadosFalsos]))
    }
  }
  return new RepositorioConsultaEquipamentoStub()
}

const makeValidaEstacao = (): ValidadorBD => {
  class ValidaEstacaoStub implements ValidadorBD {
    async validar (parametro: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new ValidaEstacaoStub()
}

interface SubTipos {
  sut: AlteraCadastroDeEquipamentoBD
  repositorioAlteraCadastroDeEquipamentoStub: RepositorioAlteraCadastroDeEquipamento
  repositorioConsultaEquipamentoStub: RepositorioConsultaEquipamento
  validaEstacaoStub: ValidadorBD
}

const makeSut = (): SubTipos => {
  const validaEstacaoStub = makeValidaEstacao()
  const repositorioConsultaEquipamentoStub = makeRepositorioConsultaEquipamento()
  const repositorioAlteraCadastroDeEquipamentoStub = makeRepositorioAlteraCadastroDeEquipamentoStub()
  const sut = new AlteraCadastroDeEquipamentoBD(repositorioAlteraCadastroDeEquipamentoStub, repositorioConsultaEquipamentoStub, validaEstacaoStub)
  return {
    sut,
    repositorioAlteraCadastroDeEquipamentoStub,
    repositorioConsultaEquipamentoStub,
    validaEstacaoStub
  }
}

describe('AlteraCadastroDeEquipamentoBD', () => {
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

  test('Deve retornar id inválido caso o repositorioConsultaEquipamentoStub retorne null', async () => {
    const { sut, repositorioConsultaEquipamentoStub } = makeSut()
    jest.spyOn(repositorioConsultaEquipamentoStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
    const resposta = await sut.alterar(dadosFalsos)
    expect(resposta).toEqual({ invalido: true, parametro: 'id' })
  })

  test('Deve chamar o validaEstacao com o valor correto', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    const validarSpy = jest.spyOn(validaEstacaoStub, 'validar')
    await sut.alterar(dadosFalsos)
    expect(validarSpy).toHaveBeenCalledWith(1)
  })

  test('Deve retornar um erro caso o validaEstacao retorne um erro', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dadosFalsos)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar estacaoId inválido caso o validaEstacao retorne false', async () => {
    const { sut, validaEstacaoStub } = makeSut()
    jest.spyOn(validaEstacaoStub, 'validar').mockReturnValueOnce(Promise.resolve(false))
    const resposta = await sut.alterar(dadosFalsos)
    expect(resposta).toEqual({ invalido: true, parametro: 'estacaoId' })
  })

  test('Deve chamar o repositorioAlteraCadastroDeEquipamentoStub com os valores corretos', async () => {
    const { sut, repositorioAlteraCadastroDeEquipamentoStub } = makeSut()
    const alterarSpy = jest.spyOn(repositorioAlteraCadastroDeEquipamentoStub, 'alterar')
    await sut.alterar(dadosFalsos)
    expect(alterarSpy).toHaveBeenCalledWith(dadosFalsos)
  })

  test('Deve retornar um erro caso o repositorioAlteraCadastroDeEquipamentoStub retorne um erro', async () => {
    const { sut, repositorioAlteraCadastroDeEquipamentoStub } = makeSut()
    jest.spyOn(repositorioAlteraCadastroDeEquipamentoStub, 'alterar').mockReturnValueOnce(Promise.reject(new Error()))
    const resposta = sut.alterar(dadosFalsos)
    await expect(resposta).rejects.toThrow()
  })

  test('Deve retornar um objeto com a mensagem "Cadastro alterado com sucesso" em caso de sucesso', async () => {
    const { sut } = makeSut()
    const resposta = await sut.alterar(dadosFalsos)
    expect(resposta.invalido).toBeFalsy()
    expect(resposta.cadastro).toEqual('Cadastro alterado com sucesso')
  })
})
