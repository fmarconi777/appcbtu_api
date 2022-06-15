import { RepositorioArea, ModelosAreas } from '../../../../dados/protocolos/bd/repositorio-area'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Area } from '../models/modelo-area'

export class RepositorioAreaMariaDB implements RepositorioArea {
  async consultar (area?: string | undefined): Promise<ModelosAreas> {
    AuxiliaresMariaDB.verificaConexao()
    return await Area.findOne({ where: { nome: area } })
  }
}
