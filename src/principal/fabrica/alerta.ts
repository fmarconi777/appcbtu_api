import { ControladorDeAlerta } from '../../apresentacao/controladores/alerta'
import { CadastroDeAlerta } from '../../dados/casos-de-uso/alerta/cadastro-de-alerta-bd'
import { RepositorioAlertaMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/alerta'
import { RepositorioLogDeErroMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/log'
import { Controlador } from '../../apresentacao/protocolos/controlador'
import { DecoradorControladorLog } from '../decoradores/log'
import { ConsultaAlertaBD } from '../../dados/casos-de-uso/alerta/consulta-alerta-bd'
import { ValidadorDeSigla } from '../../utilidades/validadores/validador-de-sigla'
import { ValidadorDeEstacao } from '../../utilidades/validadores/validador-de-estacao'
import { AuxiliarDadosAlerta } from '../../utilidades/auxiliares/auxiliar-dados-alerta'
import { ConsultaEstacaoBD } from '../../dados/casos-de-uso/estacao/consulta-estacao-bd'
import { RepositorioEstacaoMariaDB } from '../../infraestrutura/bd/mariadb/repositorio/estacao'

export const criaControladorDeAlerta = (): Controlador => {
  const repositorioAlerta = new RepositorioAlertaMariaDB()
  const repositorioEstacao = new RepositorioEstacaoMariaDB()
  const consultaEstacaoBD = new ConsultaEstacaoBD(repositorioEstacao)
  const auxiliarDadosAlerta = new AuxiliarDadosAlerta(repositorioAlerta)
  const validadorDeEstacao = new ValidadorDeEstacao(consultaEstacaoBD)
  const consultaAlertaBD = new ConsultaAlertaBD(repositorioAlerta, repositorioAlerta, auxiliarDadosAlerta)
  const cadastroDeAlerta = new CadastroDeAlerta(repositorioAlerta, validadorDeEstacao)
  const validadorDeSigla = new ValidadorDeSigla()
  const controladorDeAlerta = new ControladorDeAlerta(cadastroDeAlerta, consultaAlertaBD, validadorDeSigla)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeAlerta, repositorioLogDeErro)
}
