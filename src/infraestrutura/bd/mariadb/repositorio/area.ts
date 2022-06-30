import { RepositorioArea, ModelosAreas } from '../../../../dados/protocolos/bd/area/repositorio-area'
import { ConsultaAreaPorNome } from '../../../../dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioDeletaArea } from '../../../../dados/protocolos/bd/area/repositorio-deleta-area'
import { RepositorioInserirArea } from '../../../../dados/protocolos/bd/area/repositorio-inserir-area'
import { ModeloArea } from '../../../../dominio/modelos/area'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { FuncoesAuxiliares } from '../auxiliares/funcoes-auxiliares'
import { Area } from '../models/modelo-area'

export class RepositorioAreaMariaDB implements RepositorioArea, ConsultaAreaPorNome, RepositorioInserirArea, RepositorioDeletaArea {
  async consultar (area?: string | undefined): Promise<ModelosAreas> {
    AuxiliaresMariaDB.verificaConexao()
    if (area) { //eslint-disable-line
      return await Area.findOne({ where: { nome: area } })
    }
    return await Area.findAll()
  }

  async consultarPorNome (nome: string): Promise<ModeloArea | null> {
    AuxiliaresMariaDB.verificaConexao()
    const area = await Area.findOne({ where: { nome: nome } })
    return area ? FuncoesAuxiliares.mapeadorDeDados(area) : null //eslint-disable-line
  }

  async inserir (nome: string): Promise<ModeloArea> {
    AuxiliaresMariaDB.verificaConexao()
    const area = await Area.create({ nome })
    return FuncoesAuxiliares.mapeadorDeDados(area)
  }

  async deletar (nome: string): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    const areaDeletada = await Area.destroy({ where: { nome } })
    if (areaDeletada === 0) {
      return 'Erro ao deletar área'
    }
    return 'Área deletada com sucesso'
  }
}
