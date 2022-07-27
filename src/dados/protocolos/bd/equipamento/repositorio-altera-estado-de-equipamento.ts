import { EstadoEquipamento } from '../../../../dominio/casos-de-uso/equipamento/altera-estado-de-equipamento'

export { EstadoEquipamento }

export interface RepositorioAlteraEstadoDeEquipamento {
  alterarEstado: (dadosEquipamento: EstadoEquipamento) => Promise<string>
}
