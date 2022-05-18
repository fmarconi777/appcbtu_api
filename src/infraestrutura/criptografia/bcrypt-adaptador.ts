import bcrypt from 'bcrypt'
import { Encriptador } from '../../apresentacao/protocolos/encriptador'

export class BcryptAdaptador implements Encriptador {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encriptar (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
