import { RepositorioCadastroFalha } from '../../../../dados/protocolos/bd/falha/repositorio-cadastro-falha'
import { RepositorioConsultaFalha } from '../../../../dados/protocolos/bd/falha/repositorio-consulta-falha'
import { DadosFalha } from '../../../../dominio/casos-de-uso/falha/cadastro-de-falha'
import { ModeloFalha } from '../../../../dominio/modelos/falha'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Falha } from '../models/modelo-falha'

export class RepositorioFalhaMariaDB implements
RepositorioCadastroFalha,
RepositorioConsultaFalha {
  async inserir (dados: DadosFalha): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Falha.create(this.transformaDados(dados))
    return 'Falha cadastrada com sucesso'
  }

  async consultar (id?: number | undefined): Promise<ModeloFalha | ModeloFalha[] | null> {
    if (id) { // eslint-disable-line
      const resultado: any = await Falha.findByPk(id)
      if (resultado) { // eslint-disable-line
        const falha = {
          id: resultado.id.toString(),
          numFalha: resultado.numFalha.toString(),
          dataCriacao: new Date(resultado.dataCriacao).toISOString(),
          equipamentoId: resultado.equipamentoId.toString()
        }
        return falha
      }
      return resultado
    }
    return await Falha.findAll() as any
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
