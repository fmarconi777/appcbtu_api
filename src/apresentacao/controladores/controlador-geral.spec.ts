// Imports de todos os controladores aqui
import { ControladorDeEquipamento } from './equipamento'
import { ControladorDeEstacao } from './estacao'
import { ControladorDeFuncionario } from './funcionario'
import { ControladorDeAlerta } from './alerta'
import { ControladorDeLogin } from './login'

// Cadastros
import { CadastroDeFuncionario, InserirModeloFuncionario } from '../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'
import { CadastroDeEquipamento, DadosEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { CadastroAlerta, DadosAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'

// Consultas
import { ConsultaEstacao } from '../../dominio/casos-de-uso/estacao/consulta-estacao'

// Modelos
import { ModeloEquipamento } from '../../dominio/modelos/equipamento'
import { ModeloAlerta } from '../../dominio/modelos/alerta'
import { ModeloEstacao } from '../../dominio/modelos/estacao'
import { ModeloFuncionario } from '../../dominio/modelos/funcionario'
import { Autenticador, ModeloAutenticacao } from '../../dominio/casos-de-uso/autenticador/autenticador'

// Validador
import { Validador } from '../protocolos/validador'

// Logs de Erro
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroDeServidor } from '../erros/erro-de-servidor'
import { erroDeServidor } from '../auxiliares/auxiliar-http'

// Equipamento
const makeCadastroDeEquipamento = (): CadastroDeEquipamento => {
  class CadastroDeEquipamentoStub implements CadastroDeEquipamento {
    async inserir (dadosEquipamento: DadosEquipamento): Promise<ModeloEquipamento> {
      const equipamentoFalso = {
        id: 'qualquer_id',
        nome: dadosEquipamento.nome,
        tipo: dadosEquipamento.tipo,
        numFalha: dadosEquipamento.numFalha,
        estado: dadosEquipamento.estado,
        estacaoId: dadosEquipamento.estacaoId
      }
      return await new Promise(resolve => resolve(equipamentoFalso))
    }
  }
  return new CadastroDeEquipamentoStub()
}

interface SutTypes {
  sut: ControladorDeEquipamento
  cadastroDeEquipamentoStub: CadastroDeEquipamento
}

const makeSut = (): SutTypes => {
  const cadastroDeEquipamentoStub = makeCadastroDeEquipamento()
  const sut = new ControladorDeEquipamento(cadastroDeEquipamentoStub)
  return {
    sut,
    cadastroDeEquipamentoStub
  }
}

describe('Controlador de equipamentos', () => {
  test('Deve retornar codigo 400 se um nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('nome'))
  })
  test('Deve retornar codigo 400 se um tipo não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('tipo'))
  })
  test('Deve retornar codigo 400 se um numFalha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('numFalha'))
  })
  test('Deve retornar codigo 400 se um estado não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estado'))
  })
  test('Deve retornar codigo 400 se um estacaoId não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
  })
  test('Deve chamar o CadastroDeEquipamento com os valores corretos', async () => {
    const { sut, cadastroDeEquipamentoStub } = makeSut()
    const inserirSpy = jest.spyOn(cadastroDeEquipamentoStub, 'inserir')
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(inserirSpy).toHaveBeenCalledWith({
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
  test('Deve retornar codigoo 500 se o CadastroDeEquipamentos retornar um erro', async () => {
    const { sut, cadastroDeEquipamentoStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(cadastroDeEquipamentoStub, 'inserir').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erroFalso))
    })
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })
  test('Deve retornar codigoo 200 se dados válidos forem passados', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        tipo: 'qualquer_tipo',
        numFalha: 'numFalha_qualquer',
        estado: 'estado_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'qualquer_id',
      nome: 'qualquer_nome',
      tipo: 'qualquer_tipo',
      numFalha: 'numFalha_qualquer',
      estado: 'estado_qualquer',
      estacaoId: 'estacaoId_qualquer'
    })
  })
})

// Estacao
const makeConsultaEstacao = (): ConsultaEstacao => {
  class ConsultaEstacaoStub implements ConsultaEstacao {
    async consultaTodas (): Promise<ModeloEstacao[]> {
      const listaFalsa = [{
        id: 'id_qualquer',
        nome: 'nome_qualquer',
        sigla: 'sigla_qualquer',
        codigo: 'codigo_qualquer',
        endereco: 'endereco_qualquer',
        latitude: 'latitude_qualquer',
        longitude: 'longitude_qualquer'
      }]
      return await new Promise(resolve => resolve(listaFalsa))
    }

    async consulta (parametro: string): Promise<ModeloEstacao> {
      const estacaoFalsa = {
        id: 'id_valida',
        nome: 'nome_valido',
        sigla: parametro,
        codigo: 'codigo_valido',
        endereco: 'endereco_valido',
        latitude: 'latitude_valida',
        longitude: 'longitude_valida'
      }
      return await new Promise(resolve => resolve(estacaoFalsa))
    }
  }
  return new ConsultaEstacaoStub()
}

const makeValidaParametro = (): Validador => {
  class ValidaParametroStub implements Validador {
    validar (parametro: string): boolean {
      return true
    }
  }
  return new ValidaParametroStub()
}

interface SutTypes {
  sut: ControladorDeEstacao
  consultaEstacaoStub: ConsultaEstacao
  validaParametroStub: Validador
}

const makeSut = (): SutTypes => {
  const consultaEstacaoStub = makeConsultaEstacao()
  const validaParametroStub = makeValidaParametro()
  const sut = new ControladorDeEstacao(consultaEstacaoStub, validaParametroStub)
  return {
    sut,
    consultaEstacaoStub,
    validaParametroStub
  }
}

describe('Controlador de estações', () => {
  test('Deve retornar codigo 200 e todas as estações se um parâmetro não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { corpo: '' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual([{
      id: 'id_qualquer',
      nome: 'nome_qualquer',
      sigla: 'sigla_qualquer',
      codigo: 'codigo_qualquer',
      endereco: 'endereco_qualquer',
      latitude: 'latitude_qualquer',
      longitude: 'longitude_qualquer'
    }])
  })

  test('Deve chamar ConsultaEstacao com o valor correto', async () => {
    const { sut, consultaEstacaoStub } = makeSut()
    const spyConsula = jest.spyOn(consultaEstacaoStub, 'consulta')
    const requisicaoHttp = { parametro: 'sigla_qualquer' }
    await sut.tratar(requisicaoHttp)
    expect(spyConsula).toHaveBeenCalledWith('sigla_qualquer')
  })

  test('Deve retornar codigo 200 e uma estação se o parâmetro estiver correto', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = { parametro: 'sigla_valida' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valida',
      nome: 'nome_valido',
      sigla: 'sigla_valida',
      codigo: 'codigo_valido',
      endereco: 'endereco_valido',
      latitude: 'latitude_valida',
      longitude: 'longitude_valida'
    })
  })

  test('Deve retornar codigo 400 se o parâmetro estiver incorreto', async () => {
    const { sut, validaParametroStub } = makeSut()
    jest.spyOn(validaParametroStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = { parametro: 'sigla_invalida' }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(404)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('sigla'))
  })

  test('Deve retornar codigo 500 se o ConsultaEstacao retornar um erro', async () => {
    const { sut, consultaEstacaoStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    const erro = erroDeServidor(erroFalso)
    jest.spyOn(consultaEstacaoStub, 'consultaTodas').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    jest.spyOn(consultaEstacaoStub, 'consulta').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(erro))
    })
    const requisicaoHttpSemSigla = { parametro: '' }
    const requisicaoHttpComSigla = { parametro: 'sigla_qualquer' }
    const respostaHttpSemSigla = await sut.tratar(requisicaoHttpSemSigla)
    const respostaHttpComSigla = await sut.tratar(requisicaoHttpComSigla)
    expect(respostaHttpSemSigla.status).toBe(500)
    expect(respostaHttpSemSigla.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
    expect(respostaHttpComSigla.status).toBe(500)
    expect(respostaHttpComSigla.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })
})

// Funcionarios
interface SutTipos {
  sut: ControladorDeFuncionario
  validadorDeEmailStub: Validador
  CadastroDeFuncionarioStub: CadastroDeFuncionario
}
const makeCadastroDeFuncionario = (): CadastroDeFuncionario => {
  class CadastroDeFuncionarioStub implements CadastroDeFuncionario {
    async adicionar (conta: InserirModeloFuncionario): Promise<ModeloFuncionario> {
      const contafalsa = {
        id: 'id_valido',
        nome: 'nome_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_valido',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      }
      return await new Promise(resolve => resolve(contafalsa))
    }
  }
  return new CadastroDeFuncionarioStub()
}
class ValidadorDeEmailStub implements Validador {
  validar (email: string): boolean {
    return true
  }
}
const makeSut = (): SutTipos => {
  const CadastroDeFuncionarioStub = makeCadastroDeFuncionario()
  const validadorDeEmailStub = new ValidadorDeEmailStub()
  const sut = new ControladorDeFuncionario(validadorDeEmailStub, CadastroDeFuncionarioStub)
  return {
    sut,
    validadorDeEmailStub,
    CadastroDeFuncionarioStub
  }
}

describe('Controlador de Cadastro', () => {
  test('Retornar 400 quando o nome não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('nome'))
  })
  test('Retornar 400 quando o email não for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
  test('Deverá chamar ValidadorDeEmail quando o email correto for fornecido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validarEspionar = jest.spyOn(validadorDeEmailStub, 'validar')
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(validarEspionar).toHaveBeenLastCalledWith('qualquer_email@mail.com')
  })
  test('Retornar 500 quando o ValidadorDeEmail retornar uma excessão', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Retornar 400 quando a areaId não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('areaId'))
  })
  test('Retornar 400 quando a senha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        email: 'qualquer_email@mail.com',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('senha'))
  })
  test('Retornar 400 quando o confirmarsenha não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })
  test('Retornar 400 quando a confirmação de senha falhar', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'invalida_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('confirmarSenha'))
  })
  test('Deverá chamar CadastroDeFuncionario quando os valores corretos forem fornecidos', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({
      id: 'id_valido',
      nome: 'nome_valido',
      email: 'email_valido@mail.com',
      senha: 'senha_valido',
      administrador: 'administrador_valido',
      areaId: 'idarea_valida'
    })
  })
  test('Retornar 400 quando o email for invalido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        nome: 'qualquer_nome',
        email: 'email_invalido',
        senha: 'qualquer_senha',
        administrador: 'administrador_valido',
        areaId: 'idarea_valida',
        confirmarSenha: 'qualquer_senha'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })
})

// Login
const makeValidadorDeEmail = (): Validador => {
  class ValidadorDeEmailStub implements Validador {
    validar (email: string): boolean {
      return true
    }
  }
  return new ValidadorDeEmailStub()
}

const makeAutenticador = (): Autenticador => {
  class AutenticadorStub implements Autenticador {
    async autenticar (atenticacao: ModeloAutenticacao): Promise<string> {
      return await new Promise(resolve => resolve('token_qualquer'))
    }
  }
  return new AutenticadorStub()
}

interface SubTipos {
  sut: ControladorDeLogin
  validadorDeEmailStub: Validador
  autenticadorStub: Autenticador
}

const makeSut = (): SubTipos => {
  const validadorDeEmailStub = makeValidadorDeEmail()
  const autenticadorStub = makeAutenticador()
  const sut = new ControladorDeLogin(validadorDeEmailStub, autenticadorStub)
  return {
    sut,
    validadorDeEmailStub,
    autenticadorStub
  }
}

describe('Controlador de login', () => {
  test('Deve retornar erro 400 se o email não for fornecido', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('email'))
  })

  test('Deve retornar erro 400 se a senha não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('senha'))
  })

  test('Deve chamar o ValidadorDeEmail com o parametro correto', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const validadorSpy = jest.spyOn(validadorDeEmailStub, 'validar')
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(validadorSpy).toHaveBeenCalledWith('email_qualquer@mail.com')
  })

  test('Deve retornar erro 400 se o email fornecido não for válido', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    jest.spyOn(validadorDeEmailStub, 'validar').mockReturnValueOnce(false)
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroParametroInvalido('email'))
  })

  test('Deve retornar erro 500 se o validador de email retornar um erro', async () => {
    const { sut, validadorDeEmailStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(validadorDeEmailStub, 'validar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Deve chamar o Autenticador com os parametros corretos', async () => {
    const { sut, autenticadorStub } = makeSut()
    const autenticarSpy = jest.spyOn(autenticadorStub, 'autenticar')
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    await sut.tratar(requisicaoHttp)
    expect(autenticarSpy).toHaveBeenCalledWith({
      email: 'email_qualquer@mail.com',
      senha: 'senha_qualquer'
    })
  })

  test('Deve retornar erro 401 se parametros inválidos forem passados', async () => {
    const { sut, autenticadorStub } = makeSut()
    jest.spyOn(autenticadorStub, 'autenticar').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(401)
    expect(respostaHttp.corpo).toEqual(new ErroDeAutorizacao())
  })

  test('Deve retornar erro 500 se o autenticador retornar um erro', async () => {
    const { sut, autenticadorStub } = makeSut()
    const erroFalso = new Error()
    erroFalso.stack = 'stack_qualquer'
    jest.spyOn(autenticadorStub, 'autenticar').mockImplementationOnce(() => {
      throw erroFalso
    })
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(500)
    expect(respostaHttp.corpo).toEqual(new ErroDeServidor(erroFalso.stack))
  })

  test('Deve retornar erro 200 se parametros válidos forem passados', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        email: 'email_qualquer@mail.com',
        senha: 'senha_qualquer'
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(200)
    expect(respostaHttp.corpo).toEqual({ tokenDeAcesso: 'token_qualquer' })
  })
})

// Alerta
const makeCadastroAlerta = (): CadastroAlerta => {
  class CadastroDeAlertaStub implements CadastroAlerta {
    async adicionando (alerta: DadosAlerta): Promise<ModeloAlerta> {
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

interface SutTypes {
  sut: ControladorDeAlerta
  cadastroDeAlertaStub: CadastroAlerta
}

const makeSut = (): SutTypes => {
  const cadastroDeAlertaStub = makeCadastroAlerta()
  const sut = new ControladorDeAlerta(cadastroDeAlertaStub)
  return {
    sut,
    cadastroDeAlertaStub
  }
}

describe('Controlador de Alerta', () => {
  test('Deve retornar codigo 400 se uma descrição não for fornecida', async () => {
    const { sut } = makeSut()
    const requisicaoHttp = {
      corpo: {
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }
    const respostaHttp = await sut.tratar(requisicaoHttp)
    expect(respostaHttp.status).toBe(400)
    expect(respostaHttp.corpo).toEqual(new ErroFaltaParametro('estacaoId'))
  })

  test('Deve chamar o CadastroDeAlerta com os valores corretos', async () => {
    const { sut, cadastroDeAlertaStub } = makeSut()
    const adicionandoSpy = jest.spyOn(cadastroDeAlertaStub, 'adicionando')
    const requisicaoHttp = {
      corpo: {
        descricao: 'qualquer_descricao',
        prioridade: 'qualquer_prioridade',
        dataInicio: 'iniciodata_qualquer',
        dataFim: 'fimdata_qualquer',
        ativo: 'ativo_qualquer',
        estacaoId: 'estacaoId_qualquer'

      }
    }
    await sut.tratar(requisicaoHttp)
    expect(adicionandoSpy).toHaveBeenCalledWith({
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
    jest.spyOn(cadastroDeAlertaStub, 'adicionando').mockImplementationOnce(async () => {
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
      }
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
      }
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
