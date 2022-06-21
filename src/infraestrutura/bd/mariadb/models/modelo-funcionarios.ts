import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op } from 'sequelize'
import { AuxiliaresMariaDB } from '../auxiliares/auxiliar-mariadb'

const sequelize = AuxiliaresMariaDB.bd

export { Op }

export class Funcionario extends Model<
InferAttributes<Funcionario>,
InferCreationAttributes<Funcionario>
> {
  declare id: CreationOptional<number>
  declare nome: string
  declare email: string
  declare senha: string
  declare administrador: boolean
  declare areaId: number
}

Funcionario.init(
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
    email: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    senha: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    administrador: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    areaId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  },
  {
    sequelize,
    tableName: 'Funcionario',
    timestamps: false
  }
)
