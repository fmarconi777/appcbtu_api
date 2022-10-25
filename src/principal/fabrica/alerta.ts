import { DecoradorControladorLog } from '@/principal/decoradores/log'
import { ControladorDeAlerta } from '@/apresentacao/controladores/alerta'
import { Controlador } from '@/apresentacao/protocolos/controlador'
import { CadastroDeAlerta } from '@/dados/casos-de-uso/alerta/cadastro-de-alerta-bd'
import { ConsultaAlertaBD } from '@/dados/casos-de-uso/alerta/consulta-alerta-bd'
import { ConsultaEstacaoBD } from '@/dados/casos-de-uso/estacao/consulta-estacao-bd'
import { AlteraAlertaBD } from '@/dados/casos-de-uso/alerta/altera-alerta-bd'
import { DeletaAlertaBD } from '@/dados/casos-de-uso/alerta/deleta-alerta-bd'
import { ValidadorDeSigla } from '@/utilidades/validadores/validador-de-sigla'
import { ValidadorDeEstacao } from '@/utilidades/validadores/validador-de-estacao'
import { AuxiliarDadosAlerta } from '@/utilidades/auxiliares/auxiliar-dados-alerta'
import { ValidadorDeAlerta } from '@/utilidades/validadores/validador-de-alerta'
import { RepositorioAlertaMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/alerta'
import { RepositorioLogDeErroMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/log'
import { RepositorioEstacaoMariaDB } from '@/infraestrutura/bd/mariadb/repositorio/estacao'

export const criaControladorDeAlerta = (): Controlador => {
  const repositorioAlerta = new RepositorioAlertaMariaDB()
  const repositorioEstacao = new RepositorioEstacaoMariaDB()
  const consultaEstacaoBD = new ConsultaEstacaoBD(repositorioEstacao)
  const auxiliarDadosAlerta = new AuxiliarDadosAlerta()
  const validadorDeEstacao = new ValidadorDeEstacao(consultaEstacaoBD)
  const consultaAlertaBD = new ConsultaAlertaBD(repositorioAlerta, repositorioAlerta, auxiliarDadosAlerta)
  const validadorDeAlerta = new ValidadorDeAlerta(consultaAlertaBD)
  const cadastroDeAlerta = new CadastroDeAlerta(repositorioAlerta, validadorDeEstacao)
  const validadorDeSigla = new ValidadorDeSigla()
  const alteraAlertaBD = new AlteraAlertaBD(validadorDeAlerta, validadorDeEstacao, repositorioAlerta)
  const deletaAlerta = new DeletaAlertaBD(validadorDeAlerta, repositorioAlerta)
  const controladorDeAlerta = new ControladorDeAlerta(cadastroDeAlerta, consultaAlertaBD, validadorDeSigla, alteraAlertaBD, deletaAlerta)
  const repositorioLogDeErro = new RepositorioLogDeErroMariaDB()
  return new DecoradorControladorLog(controladorDeAlerta, repositorioLogDeErro)
}
