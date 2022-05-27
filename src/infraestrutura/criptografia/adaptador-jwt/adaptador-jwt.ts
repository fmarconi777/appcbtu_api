import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { Encriptador } from '../../../dados/protocolos/criptografia/encriptador'

export class AdapatadorJwt implements Encriptador {
  private readonly chaveSecreta = process.env.CHAVE_SECRETA

  async encriptar (valor: string): Promise<string> {
    jwt.sign({ id: valor }, (this.chaveSecreta as string))
    return await new Promise(resolve => resolve(''))
  }
}
