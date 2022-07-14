import { ControladorDeEquipamento } from '../../apresentacao/controladores/equipamento'
import { CadastroDeEquipamentoBd } from '../../dados/casos-de-uso/equipamento/cadastro-de-equipamento-bd'
import { RepositorioEquipamentoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/equipamento'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'
import { ConsultaEquipamentoBD } from '../../dados/casos-de-uso/equipamento/consulta-equipamento-bd'
import { ValidadorDeEstacao } from '../../utilidades/validadores/validador-de-estacao'
import { ConsultaEstacaoBD } from '../../dados/casos-de-uso/estacao/consulta-estacao-bd'
import { RepositorioEstacaoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/estacao'

export const criaControladorDeEquipamento = (): Controlador => {
  const repositorioEquipamento = new RepositorioEquipamentoMariaDB()
  const cadastroDeEquipamento = new CadastroDeEquipamentoBd(repositorioEquipamento)
  const consultaEquipamentoBD = new ConsultaEquipamentoBD(repositorioEquipamento)
  const repositorioEstacao = new RepositorioEstacaoMariaDB()
  const consultaEstacao = new ConsultaEstacaoBD(repositorioEstacao)
  const validaEstacao = new ValidadorDeEstacao(consultaEstacao)
  const controladorDeEquipamento = new ControladorDeEquipamento(cadastroDeEquipamento, consultaEquipamentoBD, validaEstacao)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeEquipamento, repositorioLogDeErro)
}
