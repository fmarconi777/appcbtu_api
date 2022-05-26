export interface ModeloAutenticacao {
  email: string
  senha: string
}

export interface Autenticador {
  autenticar: (autenticacao: ModeloAutenticacao) => Promise<string | null>
}
