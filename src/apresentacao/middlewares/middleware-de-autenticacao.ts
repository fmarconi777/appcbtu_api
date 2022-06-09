import { Middleware } from '../protocolos/middleware'
import { RequisicaoHttp, RespostaHttp } from '../protocolos/http'
import { erroDeServidor, requisicaoNegada, resposta } from '../auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '../erros/erro-acesso-negado'
import { ConsultaFuncionarioPeloToken } from '../../dominio/casos-de-uso/middleware/consulta-funcionario-por-token'

export class MiddlewareDeAutenticacao implements Middleware {
  constructor (
    private readonly consultaFuncionarioPeloToken: ConsultaFuncionarioPeloToken,
    private readonly nivel?: string
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const tokenDeAcesso = requisicaoHttp.cabecalho?.['x-access-token']
      if (tokenDeAcesso) { //eslint-disable-line
        const funcionario = await this.consultaFuncionarioPeloToken.consultar(tokenDeAcesso, this.nivel)
        if (funcionario) { //eslint-disable-line
          return resposta({ idFuncionario: funcionario.id })
        }
      }
      return requisicaoNegada(new ErroAcessoNegado())
    } catch (erro: any) {
      return erroDeServidor(erro)
    }
  }
}
