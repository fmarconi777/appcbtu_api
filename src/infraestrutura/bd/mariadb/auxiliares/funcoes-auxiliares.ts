export const FuncoesAuxiliares = {
  mapeadorDeDados (dados: any): any {
    const novosDados: {[key: string]: string} = {}
    const valores: any[] = Object.values(dados)
    const arrayDados: any[] = Object.entries(valores[0])
    arrayDados.map(([chave, valor]) => (novosDados[chave] = String(valor)))
    return novosDados
  }
}
