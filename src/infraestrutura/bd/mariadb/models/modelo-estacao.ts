import { DataTypes, Model, Optional } from 'sequelize'
import { bd } from '../auxiliares/auxiliar-mariadb'
import { ModeloEstacao } from '../../../../dominio/modelos/estacao'
import { Equipamento } from './modelo-equipamento'

interface AtributosEstacao extends Optional<ModeloEstacao, 'id'> {}

export interface InstanciaEstacao extends Model<ModeloEstacao, AtributosEstacao> {}

export const Estacao = bd.define<InstanciaEstacao>(
  'Estacao',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    nome: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    sigla: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    codigo: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    endereco: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    latitude: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    longitude: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'Estacao',
    timestamps: false
  }
)

Estacao.hasMany(Equipamento, {
  sourceKey: 'id',
  foreignKey: 'estacaoId',
  as: 'equipamento'
})

Equipamento.belongsTo(Estacao, {
  foreignKey: 'estacaoId',
  as: 'estacao'
})
