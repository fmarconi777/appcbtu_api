import { RepositorioArea, ModelosAreas } from '../../../../dados/protocolos/bd/area/repositorio-area'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Area } from '../models/modelo-area'

export class RepositorioAreaMariaDB implements RepositorioArea {
  async consultar (area?: string | undefined): Promise<ModelosAreas> {
    AuxiliaresMariaDB.verificaConexao()
    if (area) { //eslint-disable-line
      return await Area.findOne({ where: { nome: area } })
    }
    return await Area.findAll()
  }
}
