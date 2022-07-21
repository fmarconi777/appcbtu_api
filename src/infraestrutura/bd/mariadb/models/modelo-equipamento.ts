import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'
import { Falha } from './modelo-falha'

const sequelize = AuxiliaresMariaDB.bd

export class Equipamento extends Model<
InferAttributes<Equipamento>,
InferCreationAttributes<Equipamento>
> {
  declare id: CreationOptional<number>
  declare nome: string
  declare tipo: string
  declare estado: number
  declare estacaoId: number
}

Equipamento.init(
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
    tipo: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    estado: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    estacaoId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  },
  {
    sequelize,
    tableName: 'Equipamento',
    timestamps: false
  }
)

Equipamento.hasMany(Falha, {
  sourceKey: 'id',
  foreignKey: 'equipamentoId',
  as: 'equipamento'
})

Falha.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento'
})
