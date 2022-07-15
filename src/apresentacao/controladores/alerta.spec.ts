import { ControladorDeAlerta } from './alerta'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { CadastroAlerta, DadosAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { ModeloAlerta } from '../../dominio/modelos/alerta'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ConsultaAlerta } from '../../dominio/casos-de-uso/alerta/consulta-alerta'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { erroDeServidor } from '../auxiliares/auxiliar-http'
const makeCadastroAlerta = (): CadastroAlerta => {
  class CadastroDeAlertaStub implements CadastroAlerta {
    async inserir (alerta: DadosAlerta): Promise<ModeloAlerta> {
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
    async consultaalerta (): Promise<ModeloAlerta | null> {
      const listaFalsa = {
        id: 'id_valida',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        estacaoId: 'estacaoid_valida'
      }
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consultaalertaTodas (): Promise<ModeloAlerta[]> {
      const alertaFalsa = [{
        id: 'id_qualquer',
        descricao: 'descricao_qualquer',
        prioridade: 'prioridade_qualquer',
        dataInicio: 'datainicio_qualquer',
        dataFim: 'datafim_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoid_qualquer'
      }]
      return await new Promise(resolve => resolve(alertaFalsa))
    }
  }
  return new ConsultaAlertaStub()
}

interface SutTypes {
  sut: ControladorDeAlerta
  cadastroDeAlertaStub: CadastroAlerta
  consultaAlertaStub: ConsultaAlerta
}

const makeSut = (): SutTypes => {
  const cadastroDeAlertaStub = makeCadastroAlerta()
  const consultaAlertaStub = makeConsultaAlerta()
  const sut = new ControladorDeAlerta(cadastroDeAlertaStub, consultaAlertaStub)
  return {
    sut,
    cadastroDeAlertaStub,
    consultaAlertaStub
  }
}

describe('Controlador de Alerta', () => {
  describe('Metodos Post', () => {
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
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      await sut.tratar(requisicaoHttp)
      expect(inserirSpy).toHaveBeenCalledWith({
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      })
    })
    test('Deve retornar codigoo 500 se o CadastroDeAlerta retornar um erro', async () => {
      const { sut, cadastroDeAlertaStub } = makeSut()
      const erroFalso = new Error()
      erroFalso.stack = 'stack_qualquer'
      jest.spyOn(cadastroDeAlertaStub, 'inserir').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erroFalso))
      })
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'POST'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(500)
      expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    })
    test('Deve retornar codigoo 200 se dados válidos forem passados', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
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
    test('Deve retornar codigo 400 se um método não suportado for fornecido', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = {
        corpo: {
          descricao: 'qualquer_descricao',
          prioridade: 'qualquer_prioridade',
          dataInicio: 'iniciodata_qualquer',
          dataFim: 'fimdata_qualquer',
          ativo: 'ativo_qualquer',
          estacaoId: 'estacaoId_qualquer'
        },
        metodo: 'metodo_invalido'
      }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(400)
      expect(respostaHttp.corpo).toEqual(new ErroMetodoInvalido())
    })
  })
  describe('Metodos Get', () => {
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
        estacaoId: 'estacaoid_qualquer'
      }])
    })
    test('Deve chamar ConsultaAlerta com o valor correto', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      const spyConsula = jest.spyOn(consultaAlertaStub, 'consultaalerta')
      const requisicaoHttp = { parametro: 'alerta_qualquer', metodo: 'GET' }
      await sut.tratar(requisicaoHttp)
      expect(spyConsula).toHaveBeenCalledWith('alerta_qualquer')
    })
    test('Deve retornar codigo 200 e um alerta se o parâmetro estiver correto', async () => {
      const { sut } = makeSut()
      const requisicaoHttp = { parametro: '1', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(200)
      expect(respostaHttp.corpo).toEqual({
        id: 'id_valida',
        descricao: 'descricao_valida',
        prioridade: 'prioridade_valida',
        dataInicio: 'datainicio_valida',
        dataFim: 'datafim_valida',
        ativo: 'ativo_valida',
        estacaoId: 'estacaoid_valida'
      })
    })

    test('Deve retornar codigo 404 se o ConsultaAlerta retornar null', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      jest.spyOn(consultaAlertaStub, 'consultaalerta').mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const requisicaoHttp = { parametro: 'alerta_invalido', metodo: 'GET' }
      const respostaHttp = await sut.tratar(requisicaoHttp)
      expect(respostaHttp.status).toBe(404)
      expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('id'))
    })

    test('Deve retornar codigo 500 se o ConsultaAlerta retornar um erro', async () => {
      const { sut, consultaAlertaStub } = makeSut()
      const erroFalso = new Error()
      erroFalso.stack = 'stack_qualquer'
      const erro = erroDeServidor(erroFalso)
      jest.spyOn(consultaAlertaStub, 'consultaalertaTodas').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erro))
      })
      jest.spyOn(consultaAlertaStub, 'consultaalerta').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(erro))
      })
      const requisicaoHttpSemAlerta = { parametro: '', metodo: 'GET' }
      const requisicaoHttpComAlerta = { parametro: 'alerta_qualquer', metodo: 'GET' }
      const respostaHttpSemAlerta = await sut.tratar(requisicaoHttpSemAlerta)
      const respostaHttpComAlerta = await sut.tratar(requisicaoHttpComAlerta)
      expect(respostaHttpSemAlerta.status).toBe(500)
      expect(respostaHttpSemAlerta.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
      expect(respostaHttpComAlerta.status).toBe(500)
      expect(respostaHttpComAlerta.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    })
  })
})
