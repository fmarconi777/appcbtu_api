import { DecoradorControladorLog } from '@/principal/decoradores/log'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { ControladorDeFuncionario } from '@/apresentacao/controladores/funcionario'
import { BdAdicionarConta } from '@/dados/casos-de-uso/funcionario/bd-adicionar-conta'
import { ValidadorDeEmailAdaptador } from '@/utilidades/validadores/validador-de-email'
import { BcryptAdaptador } from '@/infraestrutura/criptografia/bcrypt-adaptador/bcrypt-adaptador'
import { RepositorioLogDeErroMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/log'
import { RepositorioFuncionarioMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/funcionario'

export const criaControladorDeFuncionario = (): Controlador => {
  const validadorDeEmail = new ValidadorDeEmailAdaptador()
  const bcryptAdaptador = new BcryptAdaptador()
  const repositorioFuncionario = new RepositorioFuncionarioMariaDB()
  const bdAdiconarConta = new BdAdicionarConta(bcryptAdaptador, repositorioFuncionario, repositorioFuncionario)
  const controladorFuncionario = new ControladorDeFuncionario(validadorDeEmail, bdAdiconarConta)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorFuncionario, repositorioLogDeErro)
}
