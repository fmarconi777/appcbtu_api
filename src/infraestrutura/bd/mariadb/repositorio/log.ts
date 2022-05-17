import { RepositorioLogDeErro } from '../../../../dados/protocolos/repositorio-log-de-erro'
import { Erros } from '../models/modelo-erros'

export class RepositorioLogDeErroMariaDB implements RepositorioLogDeErro {
  async logErro (stack: string): Promise<void> {
    await Erros.create({
      stack,
      dataDoErro: new Date()
    })
  }
}
