import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { Decriptador } from '../../../dados/protocolos/criptografia/decriptador'
import { Encriptador } from '../../../dados/protocolos/criptografia/encriptador'

export class AdapatadorJwt implements Encriptador, Decriptador {
  private readonly chaveSecreta = process.env.CHAVE_SECRETA

  async encriptar (valor: string): Promise<string> {
    const tokenDeAcesso = jwt.sign({ id: valor }, (this.chaveSecreta as string), { expiresIn: '4h' })
    return tokenDeAcesso
  }

  async decriptar (token: string): Promise<string | null> {
    const valor: any = jwt.verify(token, (this.chaveSecreta as string))
    return valor
  }
}
