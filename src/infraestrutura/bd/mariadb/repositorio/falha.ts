import { RepositorioCadastroFalha } from '../../../../dados/protocolos/bd/falha/repositorio-cadastro-falha'
import { ModeloFalha } from '../../../../dominio/modelos/falha'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Falha } from '../models/modelo-falha'

export class RepositorioFalhaMariaDB implements RepositorioCadastroFalha {
  async inserir (dados: ModeloFalha): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    const falha = await Falha.create(this.transformaDados(dados))
    return falha ? 'Falha cadastrada com sucesso' : 'Erro ao cadastrar' // eslint-disable-line
  }

  private transformaDados (dadosFalha: ModeloFalha): any {
    const { numFalha, dataCriacao, equipamentoId } = dadosFalha
    return {
      numFalha: +numFalha,
      dataCriacao: dataCriacao,
      equipamentoId: +equipamentoId
    }
  }
}
