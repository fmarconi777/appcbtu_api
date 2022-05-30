import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { bd as sequelize } from '../auxiliares/auxiliar-mariadb'

export class Alerta extends Model<
InferAttributes<Alerta>,
InferCreationAttributes<Alerta>
> {
  declare id: CreationOptional<number>
  declare descricao: string
  declare prioridade: string
  declare dataInicio: string
  declare dataFim: string
  declare ativo: boolean
  declare estacaoId: number
}

Alerta.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    descricao: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    prioridade: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    dataInicio: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    dataFim: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    ativo: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    estacaoId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  },
  {
    sequelize,
    tableName: 'Alerta',
    timestamps: false
  }
)
