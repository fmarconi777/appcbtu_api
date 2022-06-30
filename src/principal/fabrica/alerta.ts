import { ControladorDeAlerta } from '../../apresentacao/controladores/alerta'
import { CadastroDeAlerta } from '../../dados/casos-de-uso/alerta/alerta'
import { RepositorioAlertaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/alerta'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'
import { ValidadorDeAlerta } from '../../utilidades/validadores/validador-de-alerta'
import { ConsultaAlertaBD } from '../../dados/casos-de-uso/alerta/consulta-alerta'

export const criaControladorDeAlerta = (): Controlador => {
  const inserirRepositorioAlerta = new RepositorioAlertaMariaDB()
  const validadorDeAlerta = new ValidadorDeAlerta()
  const consultaAlertaBD = new ConsultaAlertaBD(inserirRepositorioAlerta)
  const cadastroDeAlerta = new CadastroDeAlerta(inserirRepositorioAlerta)
  const controladorDeAlerta = new ControladorDeAlerta(cadastroDeAlerta, consultaAlertaBD, validadorDeAlerta)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeAlerta, repositorioLogDeErro)
}
