import conexao from './index'
import { Funcionario } from './modelo-funcionarios'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

const sequelize = conexao.sequelize

export class Area extends Model<
InferAttributes<Area>,
InferCreationAttributes<Area>
> {
  declare id: CreationOptional<number>
  declare nome: string
}

Area.init(
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
    }
  },
  {
    sequelize,
    tableName: 'Area',
    timestamps: false
  }
)

Area.hasMany(Funcionario, {
  sourceKey: 'id',
  foreignKey: 'areaId',
  as: 'area'
})

Funcionario.belongsTo(Area, {
  foreignKey: 'areaId',
  as: 'area'
})
