import { ValidadorBD } from '../../apresentacao/protocolos/validadorBD'
import { ConsultaEstacao } from '../../dominio/casos-de-uso/estacao/consulta-estacao'

export class ValidadorDeEstacao implements ValidadorBD {
  constructor (private readonly consultaEstacao: ConsultaEstacao) {}

  async validar (id: number): Promise<boolean> {
    const listaEstacoes = await this.consultaEstacao.consultarTodas()
    return listaEstacoes.some(estacao => +estacao.id === id)
  }
}
