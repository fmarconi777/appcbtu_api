import { ModeloArea } from '@/dominio/modelos/area'
import { RepositorioAlteraArea } from '@/dados/protocolos/bd/area/repositorio-altera-area'
import { RepositorioArea, ModelosAreas } from '@/dados/protocolos/bd/area/repositorio-area'
import { ConsultaAreaPorId } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-id'
import { ConsultaAreaPorNome } from '@/dados/protocolos/bd/area/repositorio-consulta-area-por-nome'
import { RepositorioDeletaArea } from '@/dados/protocolos/bd/area/repositorio-deleta-area'
import { RepositorioInserirArea } from '@/dados/protocolos/bd/area/repositorio-inserir-area'
import { AuxiliaresMariaDB } from '@/infraestrutura/bd/mariadb/auxiliares/auxiliar-mariadb'
import { FuncoesAuxiliares } from '@/infraestrutura/bd/mariadb/auxiliares/funcoes-auxiliares'
import { Area } from '@/infraestrutura/bd/mariadb/models/modelo-area'

export class RepositorioAreaMariaDB implements
RepositorioArea,
ConsultaAreaPorNome,
ConsultaAreaPorId,
RepositorioInserirArea,
RepositorioDeletaArea,
RepositorioAlteraArea {
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

  async consultarPorId (id: number): Promise<ModeloArea | null> {
    AuxiliaresMariaDB.verificaConexao()
    const area = await Area.findOne({ where: { id } })
    return area ? FuncoesAuxiliares.mapeadorDeDados(area) : null //eslint-disable-line
  }

  async inserir (id: number, nome: string): Promise<ModeloArea> {
    AuxiliaresMariaDB.verificaConexao()
    const area = await Area.create({ id, nome })
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

  async alterar (nome: string, parametro: string): Promise<string> {
    AuxiliaresMariaDB.verificaConexao()
    await Area.update({ nome }, { where: { nome: parametro } })
    return 'Área alterada com sucesso'
  }
}
