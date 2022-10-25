import { CadastroDeEquipamento, DadosEquipamento } from '@/dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ValidadorBD } from '@/dados/protocolos/utilidades/validadorBD'
import { RepositorioEquipamento } from '@/dados/protocolos/bd/equipamento/repositorio-equipamento'

export class CadastroDeEquipamentoBd implements CadastroDeEquipamento {
  constructor (
    private readonly inserirRepositorioEquipamento: RepositorioEquipamento,
    private readonly validaEstacao: ValidadorBD
  ) {}

  async inserir (dadosDoEquipamento: DadosEquipamento): Promise<string | boolean> {
    const estacaoValida = await this.validaEstacao.validar(+dadosDoEquipamento.estacaoId)
    if (estacaoValida) {
      return await this.inserirRepositorioEquipamento.inserir(dadosDoEquipamento)
    }
    return estacaoValida
  }
}
