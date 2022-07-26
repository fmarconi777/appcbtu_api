export interface DadosEquipamento {
  nome: string
  tipo: string
  estado: string
  estacaoId: string
}

export interface CadastroDeEquipamento {
  inserir: (equipamento: DadosEquipamento) => Promise<string | boolean>
}
