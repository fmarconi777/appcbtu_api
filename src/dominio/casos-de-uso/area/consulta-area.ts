import { ModeloArea } from '../../modelos/area'

/*
Este protocolo define os métodos que classe ConsultaArea
deve ter ao ser implementada na pasta de dados. Define
o que esses métodos devem receber e o que devem retornar.
*/

export interface ConsultaArea {
  consultarTodas: () => Promise<ModeloArea[]>

  consultar: (parametro: string) => Promise<ModeloArea | null>
}
