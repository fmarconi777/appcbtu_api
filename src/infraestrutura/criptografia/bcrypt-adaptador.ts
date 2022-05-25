import bcrypt from 'bcrypt'
import { Encriptador } from '../../dados/protocolos/encriptador'
import 'dotenv/config'

export class BcryptAdaptador implements Encriptador {
  private readonly salt: number = +(process.env.SALT as string)

  async encriptar (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
