import { DeletaAlerta } from '@/dominio/casos-de-uso/alerta/deleta-alerta'
import { RepositorioAlteraAlertaAtivo } from '@/dados/protocolos/bd/alerta/repositorio-altera-alerta-ativo'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'

export class DeletaAlertaBD implements DeletaAlerta {
  constructor (
    private readonly validadorDeAlerta: ValidadorBD,
    private readonly repositorioAlteraAlertaAtivo: RepositorioAlteraAlertaAtivo
  ) {}

  async deletar (id: number): Promise<string | null> {
    const alertaValido = await this.validadorDeAlerta.validar(id)
    if (alertaValido) {
      await this.repositorioAlteraAlertaAtivo.alterarAtivo(false, id)
      return 'Alerta deletado com sucesso'
    }
    return null
  }
}
