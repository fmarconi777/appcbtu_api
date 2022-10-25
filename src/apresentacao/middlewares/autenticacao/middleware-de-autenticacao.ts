import { ConsultaFuncionarioPeloToken } from '@/dominio/casos-de-uso/middleware/autenticacao/consulta-funcionario-por-token'
import { Middleware } from '@/apresentacao/protocolos/middleware'
import { RequisicaoHttp, RespostaHttp } from '@/apresentacao/protocolos/http'
import { erroDeServidor, requisicaoNegada, resposta } from '@/apresentacao/auxiliares/auxiliar-http'
import { ErroAcessoNegado } from '@/apresentacao/erros/erro-acesso-negado'

export class MiddlewareDeAutenticacao implements Middleware {
  constructor (
    private readonly consultaFuncionarioPeloToken: ConsultaFuncionarioPeloToken,
    private readonly nivel?: string
  ) {}

  async tratar (requisicaoHttp: RequisicaoHttp): Promise<RespostaHttp> {
    try {
      const tokenDeAcesso = requisicaoHttp.cabecalho
      if (tokenDeAcesso && tokenDeAcesso !== 'undefined') { //eslint-disable-line
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
