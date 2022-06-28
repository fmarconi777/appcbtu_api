import { ValidadorArea } from '../../apresentacao/protocolos/validador-area'
import { ConsultaAreaBD } from '../../dados/casos-de-uso/area/consulta-area-bd'
import { RepositorioAreaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/area'

export class ValidadorDeArea implements ValidadorArea {
  async validar (parametro: string): Promise<boolean> {
    const repositorioArea = new RepositorioAreaMariaDB()
    const consultaAreaBD = new ConsultaAreaBD(repositorioArea)
    const listaAreas = await consultaAreaBD.consultarTodas()
    return listaAreas.some(area => area.nome === parametro)
  }
}
