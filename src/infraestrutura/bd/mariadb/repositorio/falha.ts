import { RepositorioCadastroFalha } from '../../../../dados/protocolos/bd/falha/repositorio-cadastro-falha'
import { DadosFalha } from '../../../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Falha } from '../models/modelo-falha'

export class RepositorioFalhaMariaDB implements RepositorioCadastroFalha {
  async inserir (dados: DadosFalha): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Falha.create(this.transformaDados(dados))
    return 'Falha cadastrada com sucesso'
  }

  private transformaDados (dadosFalha: DadosFalha): any {
    const { numFalha, dataCriacao, equipamentoId } = dadosFalha
    return {
      numFalha: +numFalha,
      dataCriacao: dataCriacao,
      equipamentoId: +equipamentoId
    }
  }
}
