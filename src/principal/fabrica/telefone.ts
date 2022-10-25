import { DecoradorControladorLog } from '@/principal/decoradores/log'
import { ControladorDeTelefone } from '@/apresentacao/controladores/telefone'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { ConsultaEstacaoBD } from '@/dados/casos-de-uso/estacao/consulta-estacao-bd'
import { CadastroDeTelefoneBD } from '@/dados/casos-de-uso/telefone/cadastro-de-telefone-bd'
import { ValidadorDeEstacao } from '@/utilidades/validadores/validador-de-estacao'
import { RepositorioEstacaoMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/estacao'
import { RepositorioLogDeErroMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/log'
import { RepositorioTelefoneMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/telefone'

export const criaControladorDeTelefone = (): Controlador => {
  const repositorioCadastroDeTelefone = new RepositorioTelefoneMariaDB()
  const repositorioConsultaEstacao = new RepositorioEstacaoMariaDB()
  const consultaEstacao = new ConsultaEstacaoBD(repositorioConsultaEstacao)
  const validaEstacao = new ValidadorDeEstacao(consultaEstacao)
  const cadastroDeTelefone = new CadastroDeTelefoneBD(validaEstacao, repositorioCadastroDeTelefone)
  const controladorDeTelefone = new ControladorDeTelefone(cadastroDeTelefone)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeTelefone, repositorioLogDeErro)
}
