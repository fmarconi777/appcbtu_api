import { ConsultaFuncionarioPeloToken } from '../../../dominio/casos-de-uso/middleware/consulta-funcionario-por-token'
import { ModeloFuncionario } from '../../../dominio/modelos/funcionario'
import { Decriptador } from '../../protocolos/criptografia/decriptador'

export class ConsultaFuncionarioPeloTokenBd implements ConsultaFuncionarioPeloToken {
  constructor (private readonly decriptador: Decriptador) {}

  async consultar (tokenDeAcesso: string, nivel?: string | undefined): Promise<ModeloFuncionario | null> {
    const id = await this.decriptador.decriptar(tokenDeAcesso)
    if (id) { //eslint-disable-line
      return await new Promise(resolve => resolve({
        id: 'id_qualquer',
        nome: 'nome_valido',
        email: 'email_valido@mail.com',
        senha: 'senha_valido',
        administrador: 'administrador_valido',
        areaId: 'areaid_valido'
      }))
    }
    return null
  }
}
