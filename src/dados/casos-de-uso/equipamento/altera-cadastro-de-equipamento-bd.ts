import { ValidadorBD } from '../../protocolos/utilidades/validadorBD'
import { AlteraCadastroDeEquipamento, EquipamentoValido } from '../../../dominio/casos-de-uso/equipamento/altera-cadastro-de-equipamento'
import { RepositorioAlteraCadastroDeEquipamento } from '../../protocolos/bd/equipamento/repositorio-altera-cadastro-de-equipamento'
import { RepositorioConsultaEquipamento } from '../../protocolos/bd/equipamento/repositorio-consulta-equipamento'
import { ModeloEquipamento } from '../../protocolos/bd/equipamento/repositorio-equipamento'

export class AlteraCadastroDeEquipamentoBD implements AlteraCadastroDeEquipamento {
  constructor (
    private readonly repositorioAlteraCadastroDeEquipamento: RepositorioAlteraCadastroDeEquipamento,
    private readonly repositorioConsultaEquipamento: RepositorioConsultaEquipamento,
    private readonly validaEstacao: ValidadorBD
  ) {}

  async alterar (dadosEquipamento: ModeloEquipamento): Promise<EquipamentoValido> {
    const equipamento = await this.repositorioConsultaEquipamento.consultar(+dadosEquipamento.id)
    if (equipamento) { // eslint-disable-line
      const estacaoValida = await this.validaEstacao.validar(+dadosEquipamento.estacaoId)
      if (estacaoValida) {
        const cadastroAlterado = await this.repositorioAlteraCadastroDeEquipamento.alterar(dadosEquipamento)
        return { invalido: false, parametro: '', cadastro: cadastroAlterado }
      }
      return { invalido: true, parametro: 'estacaoId' }
    }
    return { invalido: true, parametro: 'id' }
  }
}
