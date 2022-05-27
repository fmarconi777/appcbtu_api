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
  adicionando: (alerta: DadosAlerta) => Promise<ModeloAlerta>
}
