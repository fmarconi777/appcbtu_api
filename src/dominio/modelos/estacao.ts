/*
Esta interface define o medelo representado no banco de dados da tabela Estação
*/

export interface ModeloEstacao {
  id: string
  nome: string
  sigla: string
  codigo: string
  endereco: string
  latitude: string
  longitude: string
}
