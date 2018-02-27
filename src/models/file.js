import moment from 'moment'

export default (sequelize, DataTypes) => {
  const model = sequelize.define('File', {
    file_id: {
      type: DataTypes.INTEGER,
      field: 'file_id',
      primaryKey: true,
      autoIncrement: true
    },
    original_name: {
      type: DataTypes.TEXT,
      field: 'original_name',
      comment: '原文件名称.'
    },
    file_name: {
      type: DataTypes.TEXT,
      field: 'file_name',
      comment: '重命名后的文件名称 (is_folder 值为 1 时此字段也表示文件夹名称).'
    },
    fullpath: {
      type: DataTypes.TEXT,
      field: 'fullpath',
      comment: '文件相对路径.'
    },
    file_size: {
      type: DataTypes.INTEGER,
      field: 'file_size',
      comment: '文件大小.'
    },
    mime_type: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'mime_type',
      comment: '文件类型.'
    },
    is_folder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'is_folder',
      comment: '是否文件夹, 1: 是, 0: 否.'
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'is_deleted',
      comment: '文件是否已被删除, 1: 是, 0: 否.'
    },
    created_at: {
      type: DataTypes.DATE(6),
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE(6),
      field: 'updated_at'
    }
  }, {
    timestamps: false,
    tableName: 'CRP_FILE',
    comment: '文件.',
    hierarchy: {
      levelFieldName: 'level',
      foreignKey: 'parent_id',
      foreignKeyAttributes: 'parent',
      throughTable: 'CRP_FILE_ANCETORS',
      throughKey: 'file_id',
      throughForeignKey: 'parent_file_id'
    },
    getterMethods: {
      created_at () {
        const created_at = this.getDataValue('created_at')
        return moment.isDate(created_at) ? moment(created_at).valueOf() : created_at
      },
      updated_at () {
        const updated_at = this.getDataValue('updated_at')
        return moment.isDate(updated_at) ? moment(updated_at).valueOf() : updated_at
      }
    },
    hooks: {
      beforeCreate(instance) {
        instance.created_at = Number(new Date())
        instance.updated_at = Number(new Date())
      },
      beforeUpdate(instance) {
        instance.updated_at = Number(new Date())
      },
      beforeBulkCreate(instances) {
        instances.forEach(instance => {
          instance.created_at = Number(new Date())
          instance.updated_at = Number(new Date())
        })
      },
      beforeBulkUpdate(instances) {
        instances.forEach(instance => {
          instance.updated_at = Number(new Date())
        })
      }
    }
  })

  model.associate = ({File}) => {

  }

  return model
}
