import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'

const sequelize = AuxiliaresMariaDB.bd

export class Falha extends Model<
InferAttributes<Falha>,
InferCreationAttributes<Falha>
> {
  declare id: CreationOptional<number>
  declare numFalha: number
  declare dataCriacao: string
  declare equipamentoId: number
}

Falha.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    numFalha: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    dataCriacao: {
      allowNull: false,
      type: DataTypes.DATE
    },
    equipamentoId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  },
  {
    sequelize,
    tableName: 'Falha',
    timestamps: false
  }
)
