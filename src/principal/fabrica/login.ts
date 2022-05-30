import { Controlador } from '../../apresentacao/protocolos/controlador'
import { AdapatadorJwt } from '../../infraestrutura/criptografia/adaptador-jwt/adaptador-jwt'
import { BcryptAdaptador } from '../../infraestrutura/criptografia/bcrypt-adaptador/bcrypt-adaptador'
import { RepositorioFuncionarioMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/funcionario'
import { AutenticadorBD } from '../../dados/casos-de-uso/autenticador/autenticador-bd'
import { ValidadorDeEmailAdaptador } from '../../utilidades/validador-de-email'
import { ControladorDeLogin } from '../../apresentacao/controladores/login'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeLogin = (): Controlador => {
  const encriptador = new AdapatadorJwt()
  const comparadorHash = new BcryptAdaptador()
  const repositorioConsultaFuncionarioPorEmail = new RepositorioFuncionarioMariaDB()
  const autenticador = new AutenticadorBD(repositorioConsultaFuncionarioPorEmail, comparadorHash, encriptador)
  const validadorDeEmail = new ValidadorDeEmailAdaptador()
  const controladorDeLogin = new ControladorDeLogin(validadorDeEmail, autenticador)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeLogin, repositorioLogDeErro)
}
