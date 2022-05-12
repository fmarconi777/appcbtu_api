import { ControladorDeEquipamento } from '../../apresentacao/controladores/equipamento'
import { CadastroDeEquipamentoBd } from '../../dados/casos-de-uso/equipamento/cadastro-de-equipamento-bd'
import { RepositorioEquipamentoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/equipamento'

export const criaControladorDeEquipamento = (): ControladorDeEquipamento => {
  const inserirRepositorioEquipamento = new RepositorioEquipamentoMariaDB()
  const cadastroDeEquipamento = new CadastroDeEquipamentoBd(inserirRepositorioEquipamento)
  return new ControladorDeEquipamento(cadastroDeEquipamento)
}
