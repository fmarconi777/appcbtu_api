import { DadosEquipamento } from '../../../../dominio/casos-de-uso/equipamento/cadastro-de-equipamento'
import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'

export { DadosEquipamento, ModeloEquipamento }

export interface RepositorioEquipamento {
  inserir: (inserirModeloEquipamento: DadosEquipamento) => Promise<string>
}
