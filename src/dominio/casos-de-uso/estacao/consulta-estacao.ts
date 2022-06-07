import { ModeloEstacao } from '../../modelos/estacao'

/*
Este protocolo define os métodos que classe ConsultaEstacao
deve ter ao ser implementada na pasta de dados. Define
oque esses métodos devem receber e o que devem retornar.
*/

export interface ConsultaEstacao {
  consultarTodas: () => Promise<ModeloEstacao[]>

  consultar: (parametro: string) => Promise<ModeloEstacao>
}
