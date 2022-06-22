import { RepositorioLogDeErro } from '../../../../dados/protocolos/bd/log-de-erro/repositorio-log-de-erro'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Erros } from '../models/modelo-erros'

export class RepositorioLogDeErroMariaDB implements RepositorioLogDeErro {
  async logErro (stack: string): Promise<void> {
    AuxiliaresMariaDB.verificaConexao()
    await Erros.create({
      stack,
      dataDoErro: new Date()
    })
  }
}
