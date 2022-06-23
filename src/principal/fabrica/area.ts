import { ControladorDeArea } from '../../apresentacao/controladores/area'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { CadastroDeAreaBD } from '../../dados/casos-de-uso/area/cadastro-de-area-bd'
import { ConsultaAreaBD } from '../../dados/casos-de-uso/area/consulta-area-bd'
import { RepositorioAreaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/area'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { ValidadorDeArea } from '../../utilidades/validadores/validador-de-area'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeArea = (): Controlador => {
  const repositorioAreaMariaDB = new RepositorioAreaMariaDB()
  const validadorDeArea = new ValidadorDeArea()
  const cadastroDeAreaBD = new CadastroDeAreaBD(repositorioAreaMariaDB, repositorioAreaMariaDB)
  const consultaAreaBD = new ConsultaAreaBD(repositorioAreaMariaDB)
  const controladorDeArea = new ControladorDeArea(consultaAreaBD, validadorDeArea, cadastroDeAreaBD)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeArea, repositorioLogDeErro)
}
