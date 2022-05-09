import { DataTypes, Model, Optional } from 'sequelize'
import { bd } from '../auxiliares/auxiliar-mariadb'
import { ModeloEquipamento } from '../../../../dominio/modelos/equipamento'

interface AtributosEquipamento extends Optional<ModeloEquipamento, 'id'> {}

export interface InstanciaEquipamento extends Model<ModeloEquipamento, AtributosEquipamento> {}

export const Equipamento = bd.define<InstanciaEquipamento>(
  'Equipamento',
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
    num_falha: {
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
    tableName: 'Equipamento',
    timestamps: false
  }
)
