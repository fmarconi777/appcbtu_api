import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'

const sequelize = AuxiliaresMariaDB.bd

export class Telefone extends Model<
InferAttributes<Telefone>,
InferCreationAttributes<Telefone>
> {
  declare id: CreationOptional<number>
  declare numero: number
  declare estacaoId: number
}

Telefone.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    numero: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    estacaoId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    tableName: 'Telefone',
    timestamps: false
  }
)
