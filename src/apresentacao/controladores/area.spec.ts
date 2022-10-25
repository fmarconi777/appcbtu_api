import { ControladorDeArea } from './area'
import { ConsultaArea } from '@/dominio/casos-de-uso/area/consulta-area'
import { ModeloArea } from '@/dominio/modelos/area'
import { CadastroArea } from '@/dominio/casos-de-uso/area/cadastro-de-area'
import { DeletaArea } from '@/dominio/casos-de-uso/area/deleta-area'
import { AlteraArea } from '@/dominio/casos-de-uso/area/altera-area'
import { ErroParametroInvalido } from '@/apresentacao/erros/erro-parametro-invalido'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { ErroMetodoInvalido } from '@/apresentacao/erros/erro-metodo-invalido'
import { ErroFaltaParametro } from '@/apresentacao/erros/erro-falta-parametro'

describe('Controlador de estações', () => {
  const makeConsultaArea = (): ConsultaArea => {
    class ConsultaAreaStub implements ConsultaArea {
      async consultarTodas (): Promise<ModeloArea[]> {
        const listaFalsa = [{
          id: 'id_qualquer',
          nome: 'nome_qualquer'
        }]
        return await new Promise(resolve => resolve(listaFalsa))
      }

      async consultar (parametro: string): Promise<ModeloArea | null> {
        const areaFalsa = {
          id: 'id_valida',
          nome: parametro
        }
        return await new Promise(resolve => resolve(areaFalsa))
      }
    }
    return new ConsultaAreaStub()
  }

  const makeCadastroDeArea = (): CadastroArea => {
    class CadastroDeAreaStub implements CadastroArea {
      async inserir (nome: string, id: number): Promise<ModeloArea> {
        return await new Promise(resolve => resolve({
          id: id.toString(),
          nome
        }))
      }
    }
    return new CadastroDeAreaStub()
  }

  const makeDeletaArea = (): DeletaArea => {
    class DeletaAreaStub implements DeletaArea {
      async deletar (area: string): Promise<string> {
        return await new Promise(resolve => resolve('Área deletada com sucesso'))
      }
    }
    return new DeletaAreaStub()
  }

  const makeAlteraArea = (): AlteraArea => {
    class AlteraAreaStub implements AlteraArea {
      async alterar (nome: string): Promise<string> {
        return await new Promise(resolve => resolve('Área alterada com sucesso'))
      }
    }
    return new AlteraAreaStub()
  }

  interface SutTypes {
    sut: ControladorDeArea
    consultaAreaStub: ConsultaArea
    cadastroDeAreaStub: CadastroArea
    deletaAreaStub: DeletaArea
    alteraAreaStub: AlteraArea
  }

  const makeSut = (): SutTypes => {
    const alteraAreaStub = makeAlteraArea()
    const deletaAreaStub = makeDeletaArea()
    const cadastroDeAreaStub = makeCadastroDeArea()
    const consultaAreaStub = makeConsultaArea()
    const sut = new ControladorDeArea(consultaAreaStub, cadastroDeAreaStub, deletaAreaStub, alteraAreaStub)
    return {
      sut,
      consultaAreaStub,
      cadastroDeAreaStub,
      deletaAreaStub,
      alteraAreaStub
    }
  }

  test('Deve retornar status 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'metodo_invalido' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método GET', () => {
    test('Deve retornar codigo 200 e todas as áreas se um parâmetro não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { corpo: '', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual([{
        id: 'id_qualquer',
        nome: 'nome_qualquer'
      }])
    })

    test('Deve retornar codigo 500 se o método consultarTodas retornar um erro', async () => {
      const { sut, consultaAreaStub } = makeSut()
      jest.spyOn(consultaAreaStub, 'consultarTodas').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = { metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve chamar o método consultar com o valor correto caso um parâmetro seja fornecido', async () => {
      const { sut, consultaAreaStub } = makeSut()
      const spyConsula = jest.spyOn(consultaAreaStub, 'consultar')
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyConsula).toHaveBeenCalledWith('AREA_QUALQUER')
    })

    test('Deve retornar codigo 500 se o método consultar retornar um erro', async () => {
      const { sut, consultaAreaStub } = makeSut()
      jest.spyOn(consultaAreaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar codigo 404 se o método consultar retornar null', async () => {
      const { sut, consultaAreaStub } = makeSut()
      jest.spyOn(consultaAreaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = { parametro: 'area_invalida', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('área')))
    })

    test('Deve retornar codigo 200 e uma área se o parâmetro estiver correto', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'area_valida', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta({
        id: 'id_valida',
        nome: 'AREA_VALIDA'
      }))
    })
  })

  describe('Método POST', () => {
    test('Deve retornar status 400 caso o nome da área for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          id: '1'
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoImpropria(new ErroFaltaParametro('nome')))
    })

    test('Deve retornar status 400 caso o id da área for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoImpropria(new ErroFaltaParametro('id')))
    })

    test('Deve chamar o cadastroDeArea com o valor correto', async () => {
      const { sut, cadastroDeAreaStub } = makeSut()
      const inserirSpy = jest.spyOn(cadastroDeAreaStub, 'inserir')
      const requisicaoHttp = {
        corpo: {
          id: '1',
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith('AREA_QUALQUER', 1)
    })

    test('Deve retornar status 500 se o cadastroDeArea retornar um erro', async () => {
      const { sut, cadastroDeAreaStub } = makeSut()
      jest.spyOn(cadastroDeAreaStub, 'inserir').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const requisicaoHttp = {
        corpo: {
          id: '1',
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 200 se dadso válidos forem fornecidos', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          id: '1',
          nome: 'area_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(resposta({
        id: '1',
        nome: 'AREA_QUALQUER'
      }))
    })
  })

  describe('Método DELETE', () => {
    test('Deve chamar DeletaArea com o valor correto', async () => {
      const { sut, deletaAreaStub } = makeSut()
      const spyDeletar = jest.spyOn(deletaAreaStub, 'deletar')
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'DELETE' }
      await sut.tratar(requisicaoHttp)
      expect(spyDeletar).toHaveBeenCalledWith('AREA_QUALQUER')
    })

    test('Deve retornar erro 500 caso o DeletaArea retornar um erro', async () => {
      const { sut, deletaAreaStub } = makeSut()
      jest.spyOn(deletaAreaStub, 'deletar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'DELETE' }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar código 404 caso o DeletaArea retornar null', async () => {
      const { sut, deletaAreaStub } = makeSut()
      jest.spyOn(deletaAreaStub, 'deletar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = { parametro: 'area_invalida', metodo: 'DELETE' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('área')))
    })

    test('Deve retornar status 200 e a mensagem "Área deletada com sucesso" em caso de sucesso', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'area_qualquer', metodo: 'DELETE' }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toEqual(200)
      expect(resposta.corpo).toEqual('Área deletada com sucesso')
    })
  })

  describe('Método PATCH', () => {
    test('Deve retornar status 400 caso o nome da área não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'area_qualquer',
        corpo: {},
        metodo: 'PATCH'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoImpropria(new ErroFaltaParametro('nome')))
    })

    test('Deve chamar o alteraArea com o valor correto', async () => {
      const { sut, alteraAreaStub } = makeSut()
      const alterarSpy = jest.spyOn(alteraAreaStub, 'alterar')
      const requisicaoHttp = {
        parametro: 'area_qualquer',
        corpo: {
          nome: 'nome_qualquer'
        },
        metodo: 'PATCH'
      }
      await sut.tratar(requisicaoHttp)
      expect(alterarSpy).toHaveBeenCalledWith('NOME_QUALQUER', 'AREA_QUALQUER')
    })

    test('Deve retornar erro 500 caso o AlteraArea retornar um erro', async () => {
      const { sut, alteraAreaStub } = makeSut()
      jest.spyOn(alteraAreaStub, 'alterar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        parametro: 'area_qualquer',
        corpo: {
          nome: 'nome_qualquer'
        },
        metodo: 'PATCH'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar código 404 caso o AlteraArea retornar null', async () => {
      const { sut, alteraAreaStub } = makeSut()
      jest.spyOn(alteraAreaStub, 'alterar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        parametro: 'area_invalida',
        corpo: {
          nome: 'nome_qualquer'
        },
        metodo: 'PATCH'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('área')))
    })

    test('Deve retornar status 200 e a mensagem "Área alterada com sucesso" em caso de sucesso', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'area_qualquer',
        corpo: {
          nome: 'nome_qualquer'
        },
        metodo: 'PATCH'
      }
      const resposta = await sut.tratar(requisicaoHttp)
      expect(resposta.status).toEqual(200)
      expect(resposta.corpo).toEqual('Área alterada com sucesso')
    })
  })
})
