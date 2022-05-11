import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { bd as sequelize } from '../auxiliares/auxiliar-mariadb'

export class Equipamento extends Model<
InferAttributes<Equipamento>,
InferCreationAttributes<Equipamento>
> {
  declare id: CreationOptional<number>
  declare nome: string
  declare tipo: string
  declare numFalha: number
  declare estado: number
  declare estacaoId: number
}

Equipamento.init(
  {
    id: {
      // allowNull: false,
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
    numFalha: {
      allowNull: true,
      type: DataTypes.INTEGER
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
