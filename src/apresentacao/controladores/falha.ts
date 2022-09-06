import { CadastroDeFalha } from '../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { erroDeServidor, requisicaoImpropria, requisicaoNaoEncontrada, resposta } from '../auxiliares/auxiliar-http'
import { ErroFaltaParametro } from '../erros/erro-falta-parametro'
import { ErroMetodoInvalido } from '../erros/erro-metodo-invalido'
import { ErroParametroInvalido } from '../erros/erro-parametro-invalido'
import { Controlador } from '../protocolos/controlador'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { ValidadorBD } from '../../dados/protocolos/utilidades/validadorBD'

export class ControladorDeFalha implements Controlador {
  constructor (
    private readonly validaEquipamento: ValidadorBD,
    private readonly cadastroDeFalha: CadastroDeFalha
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    const metodo = requisicaoHttp.metodo
    switch (metodo) {
      case 'POST':
        try {
          const camposRequeridos = ['numFalha', 'equipamentoId']
          for (const campo of camposRequeridos) {
            if (!requisicaoHttp.corpo[campo]) { // eslint-disable-line
              return requisicaoImpropria(new ErroFaltaParametro(campo))
            }
          }
          const equipamentoIdValido = await this.validaEquipamento.validar(+requisicaoHttp.corpo.equipamentoId)
          if (!equipamentoIdValido) {
            return requisicaoNaoEncontrada(new ErroParametroInvalido('equipamentoId'))
          }
          const dados = requisicaoHttp.corpo
          const falha = await this.cadastroDeFalha.inserir(dados)
          return resposta(falha)
        } catch (erro: any) {
          return erroDeServidor(erro)
        }
      default:
        return requisicaoImpropria(new ErroMetodoInvalido())
    }
  }
}
