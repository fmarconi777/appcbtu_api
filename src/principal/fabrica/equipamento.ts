import { ControladorDeEquipamento } from '../../apresentacao/controladores/equipamento'
import { CadastroDeEquipamentoBd } from '../../dados/casos-de-uso/equipamento/cadastro-de-equipamento-bd'
import { RepositorioEquipamentoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/equipamento'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'
import { ConsultaEquipamentoBD } from '../../dados/casos-de-uso/equipamento/consulta-equipamento-bd'

export const criaControladorDeEquipamento = (): Controlador => {
  const repositorioEquipamento = new RepositorioEquipamentoMariaDB()
  const cadastroDeEquipamento = new CadastroDeEquipamentoBd(repositorioEquipamento)
  const consultaEquipamentoBD = new ConsultaEquipamentoBD(repositorioEquipamento)
  const controladorDeEquipamento = new ControladorDeEquipamento(cadastroDeEquipamento, consultaEquipamentoBD)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeEquipamento, repositorioLogDeErro)
}
