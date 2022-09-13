export interface DeletaAlerta {
  deletar: (id: number) => Promise<string | null>
}
