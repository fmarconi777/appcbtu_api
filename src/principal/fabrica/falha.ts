import { ControladorDeFalha } from '../../apresentacao/controladores/falha'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { ConsultaEquipamentoBD } from '../../dados/casos-de-uso/equipamento/consulta-equipamento-bd'
import { CadastroDeFalhaBD } from '../../dados/casos-de-uso/falha/cadastro-de-falha-bd'
import { RepositorioEquipamentoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/equipamento'
import { RepositorioFalhaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/falha'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { ValidadorDeEquipamento } from '../../utilidades/validadores/validador-de-equipamento'
import { DecoradorControladorLog } from '../decoradores/log'

export const criaControladorDeFalha = (): Controlador => {
  const repositorioCadastroFalha = new RepositorioFalhaMariaDB()
  const cadastroDeFalha = new CadastroDeFalhaBD(repositorioCadastroFalha)
  const repositorioConsultaEquipamento = new RepositorioEquipamentoMariaDB()
  const consultaEquipamento = new ConsultaEquipamentoBD(repositorioConsultaEquipamento)
  const validaEquipamento = new ValidadorDeEquipamento(consultaEquipamento)
  const controladorDeFalha = new ControladorDeFalha(validaEquipamento, cadastroDeFalha)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeFalha, repositorioLogDeErro)
}