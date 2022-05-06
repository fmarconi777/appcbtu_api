import { ModeloEquipamento } from '../../modelos/equipamento'

export interface InserirModeloEquipamento {
  nome: string
  tipo: string
  num_falha: string
  estado: string
  estacaoId: string
}

export interface CadastroDeEquipamento {
  inserir: (equipamento: InserirModeloEquipamento) => Promise<ModeloEquipamento>
}
