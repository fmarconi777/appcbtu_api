import { ControladorDeEstacao } from '../../apresentacao/controladores/estacao'
import { ConsultaEstacaoBD } from '../../dados/casos-de-uso/estacao/consulta-estacao-bd'
import { RepositorioEstacaoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/estacao'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { ValidadorDeSigla } from '../../utilidades/validadores/validador-de-sigla'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeEstacao = (): Controlador => {
  const consultaRepositorioEstacao = new RepositorioEstacaoMariaDB()
  const validadorDeParametro = new ValidadorDeSigla()
  const consultaEstacaoBD = new ConsultaEstacaoBD(consultaRepositorioEstacao)
  const controladorDeEstacao = new ControladorDeEstacao(consultaEstacaoBD, validadorDeParametro)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeEstacao, repositorioLogDeErro)
}
