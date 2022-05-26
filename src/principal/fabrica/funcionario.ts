import { ControladorDeFuncionario } from '../../apresentacao/controladores/funcionario'
import { ValidadorDeEmailAdaptador } from '../../utilidades/validador-de-email'
import { BdAdicionarConta } from '../../dados/casos-de-uso/funcionario/bd-adicionar-conta'
import { BcryptAdaptador } from '../../infraestrutura/criptografia/bcrypt-adaptador'
import { DecoradorControladorLog } from '../decoradores/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { RepositorioFuncionarioMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/funcionario'
export const criaControladorDeFuncionario = (): Controlador => {
  const validadorDeEmail = new ValidadorDeEmailAdaptador()
  const bcryptAdaptador = new BcryptAdaptador()
  const repositorioFuncionario = new RepositorioFuncionarioMariaDB()
  const bdAdiconarConta = new BdAdicionarConta(bcryptAdaptador, repositorioFuncionario)
  const controladorFuncionario = new ControladorDeFuncionario(validadorDeEmail, bdAdiconarConta)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorFuncionario, repositorioLogDeErro)
}
