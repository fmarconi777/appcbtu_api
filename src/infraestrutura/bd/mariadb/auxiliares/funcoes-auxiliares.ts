export const FuncoesAuxiliares = {
  mapeadorDeDados (dados: any): any {
    const valores: any[] = Object.values(dados)
    const arrayDados: any[] = Object.entries(valores[0])
    arrayDados.map(([chave, valor]) => (dados[chave] = valor.toString()))
    return dados
  }
}
