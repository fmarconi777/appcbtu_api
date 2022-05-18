import { ControladorDeEquipamento } from '../../apresentacao/controladores/equipamento'
import { CadastroDeEquipamentoBd } from '../../dados/casos-de-uso/equipamento/cadastro-de-equipamento-bd'
import { RepositorioEquipamentoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/equipamento'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeEquipamento = (): Controlador => {
  const inserirRepositorioEquipamento = new RepositorioEquipamentoMariaDB()
  const cadastroDeEquipamento = new CadastroDeEquipamentoBd(inserirRepositorioEquipamento)
  const controladorDeEquipamento = new ControladorDeEquipamento(cadastroDeEquipamento)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeEquipamento, repositorioLogDeErro)
}
