import { ConsultaAdministrador } from '../../../../dominio/casos-de-uso/middleware/administrador/consulta-administrador'
import { ConsultaFuncionarioPorNome } from '../../../protocolos/bd/funcionario/repositorio-consulta-funcionario-por-nome'

export class ConsultaAdministradorBD implements ConsultaAdministrador {
  constructor (private readonly repositorioConsultaFuncionarioPorNome: ConsultaFuncionarioPorNome) {}

  async consultar (): Promise<boolean> {
    if (await this.repositorioConsultaFuncionarioPorNome.consultarPorNome('admin')) { //eslint-disable-line
      return true
    }
    return false
  }
}
