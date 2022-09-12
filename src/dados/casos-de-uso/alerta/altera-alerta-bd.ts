import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlertaValidado, AlteraAlerta, DadosAlterados } from '../../../dominio/casos-de-uso/alerta/altera-alerta'
import { RepositorioAlteraAlerta } from '../../protocolos/bd/alerta/repositorio-altera-alerta'

export class AlteraAlertaBD implements AlteraAlerta {
  constructor (
    private readonly validadorDeAlerta: ValidadorBD,
    private readonly validadorDeEstacao: ValidadorBD,
    private readonly repositorioAlteraAlerta: RepositorioAlteraAlerta
  ) {}

  async alterar (dados: DadosAlterados): Promise<AlertaValidado> {
    const alertaValido = await this.validadorDeAlerta.validar(+dados.id)
    if (alertaValido) {
      const estacaoValida = await this.validadorDeEstacao.validar(+dados.estacaoId)
      if (estacaoValida) {
        const dadosParaAlteracao = Object.assign({}, dados, { ativo: 'true' })
        const alertaAlterado = await this.repositorioAlteraAlerta.alterar(dadosParaAlteracao)
        return await Promise.resolve({ valido: true, resposta: alertaAlterado })
      }
      return { valido: false, resposta: 'estacaoId' }
    }
    return { valido: false, resposta: 'id' }
  }
}
