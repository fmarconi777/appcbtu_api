import { MiddlewareDeAdministrador } from '@/apresentacao/middlewares/administrador/middleware-de-administrador'
import { Administrador } from '@/apresentacao/protocolos/administrador'
import { CadastroAdministradorBD } from '@/dados/casos-de-uso/middleware/administrador/cadastro-de-administrador'
import { ConsultaAdministradorBD } from '@/dados/casos-de-uso/middleware/administrador/consulta-administrador'
import { AdaptadorDoReadlineSync } from '@/dados/casos-de-uso/middleware/terminal/adaptador-do-readline-sync'
import { ValidadorDeEmailAdaptador } from '@/utilidades/validadores/validador-de-email'
import { RepositorioFuncionarioMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/funcionario'
import { BcryptAdaptador } from '@/infraestrutura/criptografia/bcrypt-adaptador/bcrypt-adaptador'

const criaContaAdministrador = (): Administrador => {
  const geradorDeHash = new BcryptAdaptador()
  const repositorioFuncionario = new RepositorioFuncionarioMariaDB()
  const consultaAdministrador = new ConsultaAdministradorBD(repositorioFuncionario)
  const validadorDeEmail = new ValidadorDeEmailAdaptador()
  const adaptadorDoReadlineSync = new AdaptadorDoReadlineSync()
  const cadastroAdministrador = new CadastroAdministradorBD(geradorDeHash, repositorioFuncionario)
  return new MiddlewareDeAdministrador(consultaAdministrador, adaptadorDoReadlineSync, adaptadorDoReadlineSync, validadorDeEmail, cadastroAdministrador)
}

export const middlewareDeAdministrador = criaContaAdministrador()
