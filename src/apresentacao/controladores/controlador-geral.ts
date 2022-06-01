import { erroDeServidor, requisicaoImpropria, resposta, requisicaoNaoEncontrada } from '../auxiliares/auxiliar-http'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'

// Validador
import { Validador } from '../protocolos/validador'
// Cadastros
import { CadastroAlerta } from '../../dominio/casos-de-uso/alerta/cadastro-de-alerta'
import { CadastroDeEquipamento } from '../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { CadastroDeFuncionario } from '../../dominio/casos-de-uso/funcionario/cadastro-de-funcionario'

// Consultas
import { ConsultaEstacao } from '../../dominio/casos-de-uso/estacao/consulta-estacao'

export class ControladorDeAlerta implements Controlador {
  private readonly cadastroDeAlerta: CadastroAlerta

  constructor (cadastroDeEquipamento: CadastroAlerta) {
    this.cadastroDeAlerta = cadastroDeEquipamento
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['descricao', 'prioridade', 'dataInicio', 'dataFim', 'ativo', 'estacaoId']
      for (const campo of camposRequeridos) {
         if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro(campo))
        }
      }
      const alerta = await this.cadastroDeAlerta.adicionando(requisicaoHttp.corpo)
      return resposta(alerta)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
export class ControladorDeEquipamento implements Controlador {
  private readonly cadastroDeEquipamento: CadastroDeEquipamento

  constructor (cadastroDeEquipamento: CadastroDeEquipamento) {
    this.cadastroDeEquipamento = cadastroDeEquipamento
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'tipo', 'numFalha', 'estado', 'estacaoId']
      for (const campo of camposRequeridos) {
        if(!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroFaltaParametro(campo))
        }
      }
      const equipamento = await this.cadastroDeEquipamento.inserir(requisicaoHttp.corpo)
      return resposta(equipamento)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
export class ControladorDeEstacao implements Controlador {
  private readonly consultaEstacao: ConsultaEstacao
  private readonly validaParametro: Validador

  constructor (consultaEstacao: ConsultaEstacao, validaParametro: Validador) {
    this.consultaEstacao = consultaEstacao
    this.validaParametro = validaParametro
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const parametro = requisicaoHttp.parametro
      if (!parametro) { // eslint-disable-line
        const todasEstacoes = await this.consultaEstacao.consultaTodas()
        return resposta(todasEstacoes)
      }
      const parametroValido = this.validaParametro.validar(parametro)
      if (!parametroValido) {
        return requisicaoNaoEncontrada(new ErroParametroInvalido('sigla'))
      }
      const estacao = await this.consultaEstacao.consulta(parametro)
      return resposta(estacao)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
export class ControladorDeFuncionario implements Controlador {
  private readonly validadorDeEmail: Validador
  private readonly cadastrodeFuncionario: CadastroDeFuncionario
  constructor (validadorDeEmail: Validador, CadastroDeFuncionario: CadastroDeFuncionario) {
    this.validadorDeEmail = validadorDeEmail
    this.cadastrodeFuncionario = CadastroDeFuncionario
  }

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const camposRequeridos = ['nome', 'email', 'senha', 'administrador', 'areaId', 'confirmarSenha']
      for (const campo of camposRequeridos) {
      if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
          return requisicaoImpropria(new ErroParametroInvalido(campo))
        }
      }
      const { nome, email, senha, administrador, areaId, confirmarSenha } = requisicaoHttp.corpo
      if (senha !== confirmarSenha) {
        return requisicaoImpropria(new ErroParametroInvalido('confirmarSenha'))
      }
      const validar = this.validadorDeEmail.validar(email)
      if (!validar) {
        return requisicaoImpropria(new ErroParametroInvalido('email'))
      }
      const conta = await this.cadastrodeFuncionario.adicionar({
        nome,
        email,
        senha,
        administrador,
        areaId
      })
      return resposta(conta)
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
