import _ from 'lodash'
import moment from 'moment'

export default (sequelize, DataTypes) => {
  const model = sequelize.define('Meeting', {
    meeting_id: {
      type: DataTypes.INTEGER,
      field: 'meeting_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      field: 'name',
      comment: '会议名称.'
    },
    place: {
      type: DataTypes.TEXT,
      field: 'place',
      comment: '会议地点.'
    },
    description: {
      type: DataTypes.TEXT('long'),
      field: 'description',
      comment: '会议描述.'
    },
    begin_time: {
      type: DataTypes.DATE(6),
      field: 'begin_time',
      comment: '会议开始时间.',
      set: function(val) {
        if (_.isNull(val) || _.isUndefined(val) || _.trim(val) === '') {
          this.setDataValue('begin_time', null)
        } else if (_.isNumber(val) || (_.isString(val) && _.isNumber(_.toNumber(val)))) {
          this.setDataValue('begin_time', new Date(Number(val)))
        } else if (_.isDate(val)) {
          this.setDataValue('begin_time', val)
        }
      },
      get: function () {
        const dataVal = this.getDataValue('begin_time')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
      }
    },
    finish_time: {
      type: DataTypes.DATE(6),
      field: 'finish_time',
      comment: '会议结束时间.',
      set: function(val) {
        if (_.isNull(val) || _.isUndefined(val) || _.trim(val) === '') {
          this.setDataValue('finish_time', null)
        } else if (_.isNumber(val) || (_.isString(val) && _.isNumber(_.toNumber(val)))) {
          this.setDataValue('finish_time', new Date(Number(val)))
        } else if (_.isDate(val)) {
          this.setDataValue('finish_time', val)
        }
      },
      get: function () {
        const dataVal = this.getDataValue('finish_time')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
      }
    },
    avatar: {
      type: DataTypes.TEXT,
      field: 'avatar',
      comment: '会议封面图片, 七牛云文件 key.'
    },
    file_pics: {
      type: DataTypes.TEXT,
      field: 'file_pics',
      comment: '图片式会议文件, 七牛云文件 key, 以英文逗号 (,) 分隔.'
    },
    enabled: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'enabled',
      comment: '是否有效, 1: 有效 (默认), 0: 无效.'
    },
    is_public: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'is_public',
      comment: '是否公开会议 (有会议成员时不是公开会议), 1: 是 (默认), 0: 否.'
    },
    need_checkin: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'need_checkin',
      comment: '是否需要报名信息, 1: 是 (默认), 0: 否.'
    },
    wechat_dept_id: {
      type: DataTypes.TEXT,
      field: 'wechat_dept_id',
      comment: '有查看会议权限的微信id (用竖线【|】分隔).'
    },
    remark: {
      type: DataTypes.TEXT('long'),
      field: 'remark',
      comment: '备注.'
    },
    created_by: {
      type: DataTypes.STRING(200),
      field: 'created_by',
      comment: '创建人.'
    },
    updated_by: {
      type: DataTypes.STRING(200),
      field: 'updated_by',
      comment: '最后修改人.'
    },
    created_at: {
      type: DataTypes.DATE(6),
      field: 'created_at',
      get: function () {
        const dataVal = this.getDataValue('created_at')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
      }
    },
    updated_at: {
      type: DataTypes.DATE(6),
      field: 'updated_at',
      get: function () {
        const dataVal = this.getDataValue('updated_at')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
      }
    }
  }, {
    timestamps: false,
    tableName: 'CRP_MEETING',
    comment: '会议.',
    hooks: {
      beforeCreate(instance) {
        instance.created_at = new Date()
        instance.updated_at = new Date()
      },
      beforeUpdate(instance) {
        instance.updated_at = new Date()
      },
      beforeBulkCreate(instances) {
        instances.forEach(instance => {
          instance.created_at = new Date()
          instance.updated_at = new Date()
        })
      },
      beforeBulkUpdate(instances) {
        instances.forEach(instance => {
          instance.updated_at = new Date()
        })
      }
    }
  })

  model.associate = ({Meeting}) => {
  }

  return model
}
