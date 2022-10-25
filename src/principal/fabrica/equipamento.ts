import { DecoradorControladorLog } from '@/principal/decoradores/log'
import { ControladorDeEquipamento } from '@/apresentacao/controladores/equipamento'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { CadastroDeEquipamentoBd } from '@/dados/casos-de-uso/equipamento/cadastro-de-equipamento-bd'
import { AlteraCadastroDeEquipamentoBD } from '@/dados/casos-de-uso/equipamento/altera-cadastro-de-equipamento-bd'
import { AlteraEstadoDeEquipamentoBD } from '@/dados/casos-de-uso/equipamento/altera-estado-de-equipamento-bd'
import { DeletaEquipamentoBD } from '@/dados/casos-de-uso/equipamento/deleta-equipamento-bd'
import { ConsultaEquipamentoBD } from '@/dados/casos-de-uso/equipamento/consulta-equipamento-bd'
import { ConsultaEstacaoBD } from '@/dados/casos-de-uso/estacao/consulta-estacao-bd'
import { RepositorioEquipamentoMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/equipamento'
import { RepositorioLogDeErroMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/log'
import { ValidadorDeEstacao } from '@/utilidades/validadores/validador-de-estacao'
import { RepositorioEstacaoMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/estacao'

export const criaControladorDeEquipamento = (): Controlador => {
  const repositorioEquipamento = new RepositorioEquipamentoMariaDB()
  const consultaEquipamentoBD = new ConsultaEquipamentoBD(repositorioEquipamento)
  const repositorioEstacao = new RepositorioEstacaoMariaDB()
  const consultaEstacao = new ConsultaEstacaoBD(repositorioEstacao)
  const validadorDeEstacao = new ValidadorDeEstacao(consultaEstacao)
  const cadastroDeEquipamento = new CadastroDeEquipamentoBd(repositorioEquipamento, validadorDeEstacao)
  const alteraCadastroDeEquipamentoBD = new AlteraCadastroDeEquipamentoBD(repositorioEquipamento, repositorioEquipamento, validadorDeEstacao)
  const alteraEstadoDeEquipamento = new AlteraEstadoDeEquipamentoBD(repositorioEquipamento, repositorioEquipamento)
  const deletaEquipamentoBD = new DeletaEquipamentoBD(repositorioEquipamento, repositorioEquipamento)
  const controladorDeEquipamento = new ControladorDeEquipamento(
    cadastroDeEquipamento,
    consultaEquipamentoBD,
    alteraCadastroDeEquipamentoBD,
    alteraEstadoDeEquipamento,
    deletaEquipamentoBD
  )
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeEquipamento, repositorioLogDeErro)
}
