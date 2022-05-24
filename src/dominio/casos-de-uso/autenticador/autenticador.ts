export interface ModeloAutenticacao {
  email: string
  senha: string
}

export interface Autenticador {
  autenticar: (modeloAtenticacao: ModeloAutenticacao) => Promise<string>
}
