import { ModeloEquipamento } from '../../modelos/equipamento'

export interface DadosEquipamento {
  nome: string
  tipo: string
  numFalha: string
  estado: string
  estacaoId: string
}

export interface CadastroDeEquipamento {
  inserir: (equipamento: DadosEquipamento) => Promise<ModeloEquipamento>
}
