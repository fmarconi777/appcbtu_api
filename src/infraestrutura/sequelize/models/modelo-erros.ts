import conexao from './index'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

const sequelize = conexao.sequelize

export class Erros extends Model<
InferAttributes<Erros>,
InferCreationAttributes<Erros>
> {
  declare id: CreationOptional<number>
  declare stack: string
  declare dataDoErro: Date
}

Erros.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    stack: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    dataDoErro: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'Erros',
    timestamps: false
  }
)
