import { ModeloAlerta } from '../../modelos/alerta'

export interface DadosAlerta {
  descricao: string
  prioridade: string
  dataInicio: string
  dataFim: string
  ativo: string
  estacaoId: string
}

export interface CadastroAlerta {
  inserir: (alerta: DadosAlerta) => Promise<ModeloAlerta>
}
