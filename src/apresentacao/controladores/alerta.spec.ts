import { ControladorDeAlerta } from './alerta'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta, DadosAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../dominio/modelos/alerta'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { erroDeServidor, requisicaoNaoEncontrada } from '../auxiliares/auxiliar-http'
import { Validador } from '../protocolos/validador'
import { AlteraAlerta, AlertaValidado, DadosAlterados } from '../../dominio/casos-de-uso/alerta/altera-alerta'
import { DeletaAlerta } from '../../dominio/casos-de-uso/alerta/deleta-alerta'

const alertaFalso = {
  descricao: 'qualquer_descricao',
  prioridade: 'qualquer_prioridade',
  dataInicio: 'iniciodata_qualquer',
  dataFim: 'fimdata_qualquer',
  ativo: 'ativo_qualquer',
  estacaoId: 'estacaoId_qualquer'
}

const makeCadastroAlerta = (): CadastroAlerta => {
  class CadastroDeAlertaStub implements CadastroAlerta {
    async inserir (alerta: DadosAlerta): Promise<ModeloAlerta | null> {
      const alertaFalso = {
        id: 'qualquer_id',
        descricao: alerta.descricao,
        prioridade: alerta.prioridade,
        dataInicio: alerta.dataInicio,
        dataFim: alerta.dataFim,
        ativo: alerta.ativo,
        estacaoId: alerta.estacaoId
      }
      return await new Promise(resolve => resolve(alertaFalso))
    }
  }
  return new CadastroDeAlertaStub()
}

const makeConsultaAlerta = (): ConsultaAlerta => {
  class ConsultaAlertaStub implements ConsultaAlerta {
    async consultar (parametro?: string, parametro2?: number): Promise<any> {
      const alertaFalsa = {
        id: 'id_valida',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        sigla: 'sigla_valida'
      }
      if (parametro2) { // eslint-disable-line
        return await Promise.resolve(alertaFalsa)
      }
      return await new Promise(resolve => resolve([alertaFalsa]))
    }

    async consultarTodas (): Promise<any> {
      const listaFalsa = [{
        id: 'id_qualquer',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        dataInicio: 'datainicio_qualquer',
        dataFim: 'datafim_qualquer',
        ativo: 'ativo_qualquer',
        sigla: 'sigla_qualquer'
      }]
      return await new Promise(resolve => resolve(listaFalsa))
    }
  }
  return new ConsultaAlertaStub()
}

const makeValidadorDeSiglaStub = (): Validador => {
  class ValidadorDeSiglaStub implements Validador {
    validar (parametro: string): boolean {
      return true
    }
  }
  return new ValidadorDeSiglaStub()
}

const makeAlteraAlertaStub = (): AlteraAlerta => {
  class AlteraAlertaStub implements AlteraAlerta {
    async alterar (dados: DadosAlterados): Promise<AlertaValidado> {
      return await Promise.resolve({ valido: true, resposta: 'Alerta alterado com sucesso' })
    }
  }
  return new AlteraAlertaStub()
}

const makeDeletaAlertaStub = (): DeletaAlerta => {
  class DeletaAlertaStub implements DeletaAlerta {
    async deletar (id: number): Promise<string | null> {
      return await Promise.resolve('Alerta deletado com sucesso')
    }
  }
  return new DeletaAlertaStub()
}

interface SutTypes {
  sut: ControladorDeAlerta
  cadastroDeAlertaStub: CadastroAlerta
  consultaAlertaStub: ConsultaAlerta
  validadorDeSiglaStub: Validador
  alteraAlertaStub: AlteraAlerta
  deletaAlertaStub: DeletaAlerta
}

const makeSut = (): SutTypes => {
  const deletaAlertaStub = makeDeletaAlertaStub()
  const alteraAlertaStub = makeAlteraAlertaStub()
  const validadorDeSiglaStub = makeValidadorDeSiglaStub()
  const cadastroDeAlertaStub = makeCadastroAlerta()
  const consultaAlertaStub = makeConsultaAlerta()
  const sut = new ControladorDeAlerta(cadastroDeAlertaStub, consultaAlertaStub, validadorDeSiglaStub, alteraAlertaStub, deletaAlertaStub)
  return {
    sut,
    cadastroDeAlertaStub,
    consultaAlertaStub,
    validadorDeSiglaStub,
    alteraAlertaStub,
    deletaAlertaStub
  }
}

describe('Controlador de Alerta', () => {
  test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: alertaFalso,
      metodo: 'metodo_invalido'
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
  })

  describe('Método POST', () => {
    test('Deve retornar codigo 400 se uma descrição não for fornecida', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('descricao'))
    })

    test('Deve retornar codigo 400 se uma prioridade não for fornecida', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('prioridade'))
    })

    test('Deve retornar codigo 400 se um Inicio de Data não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataFim: 'datafim_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataInicio'))
    })

    test('Deve retornar codigo 400 se um Fim de Data não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataFim'))
    })

    test('Deve retornar codigo 400 se um estado de ativo não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('ativo'))
    })

    test('Deve retornar codigo 400 se um id de estação não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
    })

    test('Deve chamar o CadastroDeAlerta com os valores corretos', async () => {
      const { sut, cadastroDeAlertaStub } = makeSut()
      const inserirSpy = jest.spyOn(cadastroDeAlertaStub, 'inserir')
      const requisicaoHttp = {
        corpo: alertaFalso,
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith(alertaFalso)
    })

    test('Deve retornar código 500 se o CadastroDeAlerta retornar um erro', async () => {
      const { sut, cadastroDeAlertaStub } = makeSut()
      jest.spyOn(cadastroDeAlertaStub, 'inserir').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        corpo: alertaFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 404 caso o CadastroDeAlerta retorne null', async () => {
      const { sut, cadastroDeAlertaStub } = makeSut()
      jest.spyOn(cadastroDeAlertaStub, 'inserir').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = {
        corpo: alertaFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('estacaoId')))
    })

    test('Deve retornar código 200 se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: alertaFalso,
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual({
        id: 'qualquer_id',
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      })
    })
  })

  describe('Método GET', () => {
    test('Deve retornar codigo 200 e todas os alertas se um parâmetro não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { corpo: '', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual([{
        id: 'id_qualquer',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        dataInicio: 'datainicio_qualquer',
        dataFim: 'datafim_qualquer',
        ativo: 'ativo_qualquer',
        sigla: 'sigla_qualquer'
      }])
    })

    test('Deve chamar validadorDeSigla com o valor correto', async () => {
      const { sut, validadorDeSiglaStub } = makeSut()
      const spyValidar = jest.spyOn(validadorDeSiglaStub, 'validar')
      const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyValidar).toHaveBeenCalledWith('sigla_qualquer')
    })

    test('Deve retornar status 500 caso validadorDeSigla retorne um erro', async () => {
      const { sut, validadorDeSiglaStub } = makeSut()
      jest.spyOn(validadorDeSiglaStub, 'validar').mockImplementationOnce(() => { throw new Error() })
      const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar codigo 404 se o validadorDeSigla retornar false', async () => {
      const { sut, validadorDeSiglaStub } = makeSut()
      jest.spyOn(validadorDeSiglaStub, 'validar').mockReturnValueOnce(false)
      const requisicaoHttp = { parametro: 'sigla_invalida', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(404)
      expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('sigla'))
    })

    test('Deve retornar codigo 404 se o for fornecido parametro2 inválido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'sigla_valida', parametro2: 'NaN', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(404)
      expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('id'))
    })

    test('Deve chamar ConsultaAlerta com os valores corretos', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      const spyConsula = jest.spyOn(consultaAlertaStub, 'consultar')
      const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyConsula).toHaveBeenCalledWith('sigla_qualquer', undefined)
    })

    test('Deve retornar status 500 caso ConsultaAlerta retorne um erro', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      jest.spyOn(consultaAlertaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar codigo 404 se o consultaAlerta retornar null quando o parametro2 não estiver cadastrado', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      jest.spyOn(consultaAlertaStub, 'consultar').mockReturnValueOnce(Promise.resolve(null))
      const requisicaoHttp = { parametro: 'sigla_qualquer', parametro2: '13958674000', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar codigo 200 e uma lista de alertas da estação se o parâmetro estiver correto', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'sigla_qualquer', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual([{
        id: 'id_valida',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        sigla: 'sigla_valida'
      }])
    })

    test('Deve retornar codigo 200 e um alerta se o parâmetro2 estiver correto', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: 'sigla_qualquer', parametro2: '1', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual({
        id: 'id_valida',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        sigla: 'sigla_valida'
      })
    })

    test('Deve retornar codigo 500 se o ConsultaAlerta retornar um erro', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      jest.spyOn(consultaAlertaStub, 'consultarTodas').mockReturnValueOnce(Promise.reject(new Error()))
      jest.spyOn(consultaAlertaStub, 'consultar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttpSemAlerta = { parametro: '', metodo: 'GET' }
      const requisicaoHttpComAlerta = { parametro: 'sigla_qualquer', metodo: 'GET' }
      const respostaHttpSemAlerta = await sut.tratar(requisicaoHttpSemAlerta)
      const respostaHttpComAlerta = await sut.tratar(requisicaoHttpComAlerta)
      expect(respostaHttpSemAlerta).toEqual(erroDeServidor(new Error()))
      expect(respostaHttpComAlerta).toEqual(erroDeServidor(new Error()))
    })
  })

  describe('Método PATCH', () => {
    test('Deve retornar código 404 se um parametro inválido for passado', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: 'NaN',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve retornar código 400 se uma descrição não for fornecida', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('descricao'))
    })

    test('Deve retornar código 400 se uma prioridade não for fornecida', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('prioridade'))
    })

    test('Deve retornar código 400 se um Inicio de Data não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataFim: 'datafim_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataInicio'))
    })

    test('Deve retornar código 400 se um Fim de Data não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('dataFim'))
    })

    test('Deve retornar código 400 se um id de estação não for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
    })

    test('Deve chamar o alteraAlerta com os valores corretos', async () => {
      const { sut, alteraAlertaStub } = makeSut()
      const inserirSpy = jest.spyOn(alteraAlertaStub, 'alterar')
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith({
        id: '1',
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        estacaoId: 'estacaoId_qualquer'
      })
    })

    test('Deve retornar código 500 se o AlteraAlerta retornar um erro', async () => {
      const { sut, alteraAlertaStub } = makeSut()
      jest.spyOn(alteraAlertaStub, 'alterar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })

    test('Deve retornar status 404 caso o AlteraAlerta retorne a propriedade valido igual a false', async () => {
      const { sut, alteraAlertaStub } = makeSut()
      jest.spyOn(alteraAlertaStub, 'alterar').mockReturnValueOnce(Promise.resolve({ valido: false, resposta: 'parametro_invalido' }))
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('parametro_invalido')))
    })

    test('Deve retornar código 200 se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        parametro: '1',
        metodo: 'PATCH'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toBe('Alerta alterado com sucesso')
    })
  })

  describe('Método DELETE', () => {
    test('Deve retornar código 404 se um parametro inválido for passado', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        parametro: 'NaN',
        metodo: 'DELETE'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(requisicaoNaoEncontrada(new ErroParametroInvalido('id')))
    })

    test('Deve chamar deletaAlerta com o valor correto', async () => {
      const { sut, deletaAlertaStub } = makeSut()
      const deletarSpy = jest.spyOn(deletaAlertaStub, 'deletar')
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'DELETE'
      }
      await sut.tratar(requisicaoHttp)
      expect(deletarSpy).toHaveBeenCalledWith(1)
    })

    test('Deve retornar status 500 caso deletaAlerta retorne um erro', async () => {
      const { sut, deletaAlertaStub } = makeSut()
      jest.spyOn(deletaAlertaStub, 'deletar').mockReturnValueOnce(Promise.reject(new Error()))
      const requisicaoHttp = {
        parametro: '1',
        metodo: 'DELETE'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp).toEqual(erroDeServidor(new Error()))
    })
  })
})
