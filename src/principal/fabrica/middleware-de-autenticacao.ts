import { MiddlewareDeAutenticacao } from '../../apresentacao/middlewares/autenticacao/middleware-de-autenticacao'
import { Middleware } from '../../apresentacao/protocolos/middleware'
import { ConsultaFuncionarioPeloTokenBd } from '../../dados/casos-de-uso/middleware/autenticacao/consulta-funcionario-pelo-token-bd'
import { RepositorioFuncionarioMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/funcionario'
import { AdapatadorJwt } from '../../infraestrutura/criptografia/adaptador-jwt/adaptador-jwt'

export const criaMiddlewareDeAutenticacao = (nivel?: string): Middleware => {
  const repositorioFuncionarioMariaDB = new RepositorioFuncionarioMariaDB()
  const adaptadorJwt = new AdapatadorJwt()
  const consultaFuncionarioPeloToken = new ConsultaFuncionarioPeloTokenBd(adaptadorJwt, repositorioFuncionarioMariaDB)
  return new MiddlewareDeAutenticacao(consultaFuncionarioPeloToken, nivel)
}
