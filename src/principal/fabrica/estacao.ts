import { ControladorDeEstacao } from '../../apresentacao/controladores/estacao'
import { ConsultaEstacaoBD } from '../../dados/casos-de-uso/consulta-estacao-bd'
import { RepositorioEstacaoMariaDB } from '../../infraestrutura/db/mariadb/repositorio-estacao/estacao'
import { ValidadorDeParametro } from '../../utilidades/validador-de-parametro'

export const criaControladorDeEstacao = (): ControladorDeEstacao => {
  const consultaRepositorioEstacao = new RepositorioEstacaoMariaDB()
  const validadorDeParametro = new ValidadorDeParametro()
  const consultaEstacaoBD = new ConsultaEstacaoBD(consultaRepositorioEstacao)
  return new ControladorDeEstacao(consultaEstacaoBD, validadorDeParametro)
}
