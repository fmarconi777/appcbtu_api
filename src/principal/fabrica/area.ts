import { ControladorDeArea } from '../../apresentacao/controladores/area'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { AlteraAreaBD } from '../../dados/casos-de-uso/area/altera-area-bd'
import { CadastroDeAreaBD } from '../../dados/casos-de-uso/area/cadastro-de-area-bd'
import { ConsultaAreaBD } from '../../dados/casos-de-uso/area/consulta-area-bd'
import { DeletaAreaBD } from '../../dados/casos-de-uso/area/deleta-area-bd'
import { RepositorioAreaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/area'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { ValidadorDeArea } from '../../utilidades/validadores/validador-de-area'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeArea = (): Controlador => {
  const repositorioAreaMariaDB = new RepositorioAreaMariaDB()
  const consultaAreaBD = new ConsultaAreaBD(repositorioAreaMariaDB)
  const validadorDeArea = new ValidadorDeArea(consultaAreaBD)
  const deletaAreaBD = new DeletaAreaBD(validadorDeArea, repositorioAreaMariaDB)
  const cadastroDeAreaBD = new CadastroDeAreaBD(repositorioAreaMariaDB, repositorioAreaMariaDB, repositorioAreaMariaDB)
  const alteraAraBD = new AlteraAreaBD(validadorDeArea, repositorioAreaMariaDB, repositorioAreaMariaDB)
  const controladorDeArea = new ControladorDeArea(consultaAreaBD, cadastroDeAreaBD, deletaAreaBD, alteraAraBD)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeArea, repositorioLogDeErro)
}
