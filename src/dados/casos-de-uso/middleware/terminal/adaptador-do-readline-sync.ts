import { LeitorDeTerminal } from '../../../../dominio/casos-de-uso/middleware/terminal/leitor-de-terminal'
import readlineSync from 'readline-sync'

export class AdaptadorDoReadlineSync implements LeitorDeTerminal {
  perguntar (pergunta: any): string {
    const input = readlineSync.question(pergunta)
    return input
  }
}
