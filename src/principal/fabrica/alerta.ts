import { ControladorDeAlerta } from '../../apresentacao/controladores/alerta'
import { CadastroDeAlerta } from '../../dados/casos-de-uso/alerta/alerta'
import { RepositorioAlertaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/alerta'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeAlerta = (): Controlador => {
  const inserirRepositorioAlerta = new RepositorioAlertaMariaDB()
  const cadastroDeAlerta = new CadastroDeAlerta(inserirRepositorioAlerta)
  const controladorDeAlerta = new ControladorDeAlerta(cadastroDeAlerta)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeAlerta, repositorioLogDeErro)
}
