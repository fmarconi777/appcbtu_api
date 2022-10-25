import { ConsultaEstacao } from '@/dominio/casos-de-uso/estacao/consulta-estacao'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class ValidadorDeEstacao implements ValidadorBD {
  constructor (private readonly consultaEstacao: ConsultaEstacao) {}

  async validar (id: number): Promise<boolean> {
    const listaEstacoes = await this.consultaEstacao.consultarTodas()
    return listaEstacoes.some(estacao => +estacao.id === id)
  }
}
