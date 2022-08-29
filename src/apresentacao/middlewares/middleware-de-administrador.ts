import { Administrador } from '../protocolos/administrador'
import { ConsultaAdministrador } from '../../dominio/casos-de-uso/middleware/consulta-administrador'

export class MiddlewareDeAdministrador implements Administrador {
  constructor (
    private readonly consultaAdministrador: ConsultaAdministrador
  ) {}

  async tratarInput (): Promise<void> {
    try {
      await this.consultaAdministrador.consultar()
    } catch (erro: any) {
      console.error(erro)
    }
  }
}
