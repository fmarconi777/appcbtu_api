import { ControladorDeEstacao } from '../../apresentacao/controladores/estacao'
import { ConsultaEstacaoBD } from '../../dados/casos-de-uso/estacao/consulta-estacao-bd'
import { RepositorioEstacaoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/estacao'
import { ValidadorDeParametro } from '../../utilidades/validador-de-parametro'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeEstacao = (): Controlador => {
  const consultaRepositorioEstacao = new RepositorioEstacaoMariaDB()
  const validadorDeParametro = new ValidadorDeParametro()
  const consultaEstacaoBD = new ConsultaEstacaoBD(consultaRepositorioEstacao)
  const controladorDeEstacao = new ControladorDeEstacao(consultaEstacaoBD, validadorDeParametro)
  return new DecoradorControladorLog(controladorDeEstacao)
}
