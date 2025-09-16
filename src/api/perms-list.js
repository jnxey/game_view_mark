import { permsMap } from '@/api/perms';
import { isArray, mappingArrayToObject, treeToArray } from '@/tools';

const checkChildren = (list, levels) => {
  list.forEach((item) => {
    item.levels = [...levels, item.name];
    if (!!item.name) item.label = item.name;
    if (!!item.perm) {
      item.value = item.perm;
      item.title = item.perm.split(',')[0];
    } else {
      item.value = item.levels.join(',');
    }

    if (!isArray(item.children)) {
      item.children = [];
    } else {
      checkChildren(item.children, item.levels);
    }
  });
};

const _permsList = [
  {
    name: '布局',
    children: [
      {
        name: '广播室',
        children: [
          { name: '发送', perm: permsMap.layout.chat_send },
          { name: '置顶', perm: permsMap.layout.chat_send },
          { name: '取消置顶', perm: permsMap.layout.chat_top_cancel }
        ]
      }
    ]
  },
  {
    name: '彩金管理',
    children: [
      {
        name: '彩金类型',
        children: [
          { name: '列表', perm: permsMap.bonus.list.view },
          { name: '编辑', perm: permsMap.bonus.list.edit },
          { name: '删除', perm: permsMap.bonus.list.del }
        ]
      },
      {
        name: '彩金奖项',
        children: [
          { name: '列表', perm: permsMap.bonus.config.view },
          { name: '编辑', perm: permsMap.bonus.config.edit },
          { name: '删除', perm: permsMap.bonus.config.del }
        ]
      },
      {
        name: '彩金大屏设置',
        children: [{ name: '页面', perm: permsMap.bonus.desk.view }]
      }
    ]
  },
  {
    name: '大屏页面',
    children: [
      {
        name: '路单大屏',
        children: [{ name: '页面', perm: permsMap.desk.road.view }]
      },
      {
        name: '彩金大屏',
        children: [{ name: '页面', perm: permsMap.desk.bonus.view }]
      },
      {
        name: '游戏大屏',
        children: [{ name: '页面', perm: permsMap.desk.main.view }]
      }
    ]
  },
  {
    name: '货币管理',
    children: [
      {
        name: '币种设置',
        children: [
          { name: '列表', perm: permsMap.currency.config.view },
          { name: '编辑', perm: permsMap.currency.config.edit },
          { name: '删除', perm: permsMap.currency.config.del }
        ]
      },
      {
        name: '基础货币',
        children: [
          { name: '列表', perm: permsMap.currency.base.view },
          { name: '编辑', perm: permsMap.currency.base.edit },
          { name: '删除', perm: permsMap.currency.base.del }
        ]
      },
      { name: 'C码详情', children: [{ name: '列表', perm: permsMap.currency.chip.view }] }
    ]
  },
  {
    name: '外联管理',
    children: [
      {
        name: '支出费用',
        children: [
          { name: '列表', perm: permsMap.external.costs.view },
          { name: '编辑', perm: permsMap.external.costs.edit },
          { name: '删除', perm: permsMap.external.costs.del },
          { name: '日志', perm: permsMap.external.costs.log }
        ]
      },
      {
        name: '消费项目',
        children: [
          { name: '列表', perm: permsMap.external.consume_type.view },
          { name: '编辑', perm: permsMap.external.consume_type.edit },
          { name: '删除', perm: permsMap.external.consume_type.del },
          { name: '日志', perm: permsMap.external.consume_type.log }
        ]
      },
      {
        name: '车辆管理',
        children: [
          { name: '列表', perm: permsMap.external.car_administer.view },
          { name: '编辑', perm: permsMap.external.car_administer.edit },
          { name: '删除', perm: permsMap.external.car_administer.del },
          { name: '派车', perm: permsMap.external.car_administer.start },
          { name: '回库', perm: permsMap.external.car_administer.end },
          { name: '保养', perm: permsMap.external.car_administer.maintain },
          { name: '日志', perm: permsMap.external.car_administer.log }
        ]
      },
      {
        name: '用车记录',
        children: [
          { name: '列表', perm: permsMap.external.car_record.view },
          { name: '编辑', perm: permsMap.external.car_record.edit },
          { name: '日志', perm: permsMap.external.car_record.log }
        ]
      },
      {
        name: '车辆保养',
        children: [
          { name: '列表', perm: permsMap.external.car_maintain.view },
          { name: '编辑', perm: permsMap.external.car_maintain.edit },
          { name: '日志', perm: permsMap.external.car_maintain.log }
        ]
      },
      {
        name: '酒店管理',
        children: [
          { name: '列表', perm: permsMap.external.hotel_management.view },
          { name: '编辑', perm: permsMap.external.hotel_management.edit },
          { name: '删除', perm: permsMap.external.hotel_management.del },
          { name: '开房', perm: permsMap.external.hotel_management.start },
          { name: '退房', perm: permsMap.external.hotel_management.end },
          { name: '续费', perm: permsMap.external.hotel_management.continue },
          { name: '日志', perm: permsMap.external.hotel_management.log }
        ]
      },
      {
        name: '开房记录',
        children: [
          { name: '列表', perm: permsMap.external.hotel_room_record.view },
          { name: '编辑', perm: permsMap.external.hotel_room_record.edit },
          { name: '删除', perm: permsMap.external.hotel_room_record.del },
          { name: '日志', perm: permsMap.external.hotel_room_record.log }
        ]
      },
      {
        name: '房间类型',
        children: [
          { name: '列表', perm: permsMap.external.hotel_room_type.view },
          { name: '编辑', perm: permsMap.external.hotel_room_type.edit },
          { name: '删除', perm: permsMap.external.hotel_room_type.del },
          { name: '日志', perm: permsMap.external.hotel_room_type.log }
        ]
      }
    ]
  },
  {
    name: '素材管理',
    children: [{ name: '素材中心', children: [{ name: '页面', perm: permsMap.material.center.view }] }]
  },
  {
    name: '财务管理',
    children: [
      {
        name: '码房管理',
        children: [
          { name: '列表', perm: permsMap.finance.user_chip.view },
          { name: '余额操作', perm: permsMap.finance.user_chip.edit },
          { name: '日志', perm: permsMap.finance.user_chip.log }
        ]
      },
      {
        name: '台号管理',
        children: [
          { name: '列表', perm: permsMap.finance.table.view },
          { name: '编辑', perm: permsMap.finance.table.edit },
          { name: '删除', perm: permsMap.finance.table.del },
          { name: '日志', perm: permsMap.finance.table.log }
        ]
      },
      {
        name: '小费',
        children: [
          { name: '列表', perm: permsMap.finance.tip.view },
          { name: '编辑', perm: permsMap.finance.tip.edit },
          { name: '删除', perm: permsMap.finance.tip.del },
          { name: '日志', perm: permsMap.finance.tip.log }
        ]
      },
      {
        name: '柜子类型',
        children: [
          { name: '列表', perm: permsMap.finance.cabinet_type.view },
          { name: '编辑', perm: permsMap.finance.cabinet_type.edit },
          { name: '删除', perm: permsMap.finance.cabinet_type.del }
        ]
      },
      {
        name: '货币兑换',
        children: [
          { name: '列表', perm: permsMap.finance.exchange.view },
          { name: '编辑', perm: permsMap.finance.exchange.edit }
        ]
      },
      {
        name: '台号类型',
        children: [
          { name: '列表', perm: permsMap.finance.table_type.view },
          { name: '编辑', perm: permsMap.finance.table_type.edit },
          { name: '删除', perm: permsMap.finance.table_type.del }
        ]
      },
      {
        name: '洗码结算',
        children: [
          // { name: '列表', perm: permsMap.finance.code_washing.view },
          { name: '结算', perm: permsMap.finance.code_washing.settler },
          { name: '投注', perm: permsMap.finance.code_washing.bet },
          { name: '日志', perm: permsMap.finance.code_washing.log }
        ]
      },
      {
        name: '汇款方式',
        children: [
          { name: '列表', perm: permsMap.finance.remit_type.view },
          { name: '编辑', perm: permsMap.finance.remit_type.edit },
          { name: '删除', perm: permsMap.finance.remit_type.del }
        ]
      },
      {
        name: '录像机',
        children: [
          { name: '列表', perm: permsMap.finance.video_recorder.view },
          { name: '编辑', perm: permsMap.finance.video_recorder.edit },
          { name: '删除', perm: permsMap.finance.video_recorder.del }
        ]
      }
    ]
  },
  {
    name: '游戏管理',
    children: [
      {
        name: '游戏列表',
        children: [
          { name: '列表', perm: permsMap.game.list.view },
          { name: '编辑', perm: permsMap.game.list.edit },
          { name: '检测', perm: permsMap.game.list.check },
          { name: '删除', perm: permsMap.game.list.del },
          { name: '日志', perm: permsMap.game.list.log }
        ]
      },
      {
        name: '投注项',
        children: [
          { name: '列表', perm: permsMap.game.kind.view },
          { name: '编辑', perm: permsMap.game.kind.edit },
          { name: '删除', perm: permsMap.game.kind.del },
          { name: '日志', perm: permsMap.game.kind.log }
        ]
      },
      {
        name: '点码配置',
        children: [
          { name: '列表', perm: permsMap.game.chip.view },
          { name: '编辑', perm: permsMap.game.chip.edit },
          { name: '删除', perm: permsMap.game.chip.del },
          { name: '算入增减码', perm: permsMap.game.chip.bind }
        ]
      }
    ]
  },
  {
    name: '游戏数据',
    children: [
      {
        name: '开牌结果',
        children: [
          { name: '列表', perm: permsMap.game_data.bet_open.view },
          { name: '编辑', perm: permsMap.game_data.bet_open.edit },
          { name: '日志', perm: permsMap.game_data.bet_open.log }
        ]
      },
      {
        name: '会员注单',
        children: [
          { name: '列表', perm: permsMap.game_data.bet.view },
          { name: '编辑', perm: permsMap.game_data.bet.edit },
          { name: '日志', perm: permsMap.game_data.bet.log },
          { name: '彩金', perm: permsMap.game_data.bet.bonus }
        ]
      },
      { name: '风险控制', children: [{ name: '列表', perm: permsMap.game_data.risk.view }] }
    ]
  },
  {
    name: '数据报表',
    children: [
      {
        name: '会员盈亏',
        children: [
          { name: '列表', perm: permsMap.report.user.view },
          { name: '结算', perm: permsMap.report.user.settler },
          { name: '结算日志', perm: permsMap.report.user.settler_log }
        ]
      },
      { name: '台面盈亏', children: [{ name: '列表', perm: permsMap.report.table.view }] },
      { name: '每日盈亏', children: [{ name: '列表', perm: permsMap.report.day.view }] },
      { name: '每月盈亏', children: [{ name: '列表', perm: permsMap.report.month.view }] },
      {
        name: '点码',
        children: [
          { name: '列表', perm: permsMap.report.check.view },
          { name: '编辑', perm: permsMap.report.check.edit },
          { name: '增减码日志', perm: permsMap.report.check.inc_dec_log }
        ]
      },
      {
        name: '收码',
        children: [{ name: '列表', perm: permsMap.report.close.view }]
      }
    ]
  },
  {
    name: '商品管理',
    children: [
      {
        name: '店铺管理',
        children: [
          { name: '列表', perm: permsMap.goods.store.view },
          { name: '编辑', perm: permsMap.goods.store.edit },
          { name: '删除', perm: permsMap.goods.store.del }
        ]
      },
      {
        name: '库存管理',
        children: [
          { name: '列表', perm: permsMap.goods.stock.view },
          { name: '编辑', perm: permsMap.goods.stock.edit },
          { name: '删除', perm: permsMap.goods.stock.del }
        ]
      },
      {
        name: '订单管理',
        children: [
          { name: '列表', perm: permsMap.goods.order.view },
          { name: '状态', perm: permsMap.goods.order.status },
          { name: '日志', perm: permsMap.goods.order.log }
        ]
      },
      {
        name: '商品下单',
        children: [{ name: '页面', perm: permsMap.goods.book.view }]
      },
      {
        name: '商品类型',
        children: [
          { name: '列表', perm: permsMap.goods.type.view },
          { name: '编辑', perm: permsMap.goods.type.edit },
          { name: '删除', perm: permsMap.goods.type.del }
        ]
      }
    ]
  },
  {
    name: '组织管理',
    children: [
      {
        name: '部门管理',
        children: [
          { name: '列表', perm: permsMap.org.department.view },
          { name: '编辑', perm: permsMap.org.department.edit },
          { name: '删除', perm: permsMap.org.department.del }
        ]
      },
      {
        name: '岗位管理',
        children: [
          { name: '列表', perm: permsMap.org.job.view },
          { name: '编辑', perm: permsMap.org.job.edit },
          { name: '删除', perm: permsMap.org.job.del }
        ]
      }
    ]
  },
  {
    name: '员工管理',
    children: [
      {
        name: '员工资料',
        children: [
          { name: '列表', perm: permsMap.staff.admin.view },
          { name: '编辑', perm: permsMap.staff.admin.edit },
          { name: '删除', perm: permsMap.staff.admin.del }
        ]
      },
      {
        name: '楼栋管理',
        children: [
          { name: '列表', perm: permsMap.staff.building.view },
          { name: '编辑', perm: permsMap.staff.building.edit },
          { name: '删除', perm: permsMap.staff.building.del }
        ]
      },
      {
        name: '宿舍管理',
        children: [
          { name: '列表', perm: permsMap.staff.apartment.view },
          { name: '编辑', perm: permsMap.staff.apartment.edit },
          { name: '删除', perm: permsMap.staff.apartment.del }
        ]
      },
      {
        name: '房间入住',
        children: [{ name: '列表', perm: permsMap.staff.check_in.view }]
      },
      {
        name: '住户明细',
        children: [
          { name: '列表', perm: permsMap.staff.apartment_admin.view },
          { name: '绑定', perm: permsMap.staff.apartment_admin.edit },
          { name: '解绑', perm: permsMap.staff.apartment_admin.del }
        ]
      }
    ]
  },
  {
    name: '权限管理',
    children: [
      {
        name: '菜单管理',
        children: [
          { name: '列表', perm: permsMap.perms.menu.view },
          { name: '编辑', perm: permsMap.perms.menu.edit },
          { name: '删除', perm: permsMap.perms.menu.del }
        ]
      },
      {
        name: '角色管理',
        children: [
          { name: '列表', perm: permsMap.perms.role.view },
          { name: '编辑', perm: permsMap.perms.role.edit },
          { name: '删除', perm: permsMap.perms.role.del }
        ]
      },
      {
        name: '数据权限',
        children: [
          { name: '列表', perm: permsMap.perms.data.view },
          { name: '编辑', perm: permsMap.perms.data.edit },
          { name: '删除', perm: permsMap.perms.data.del }
        ]
      }
    ]
  },
  {
    name: '积分管理',
    children: [
      {
        name: '会员积分',
        children: [
          { name: '列表', perm: permsMap.point.summary.view },
          { name: '编辑', perm: permsMap.point.summary.edit },
          { name: '日志', perm: permsMap.point.summary.log }
        ]
      },
      {
        name: '消费项目',
        children: [
          { name: '列表', perm: permsMap.point.consume_name.view },
          { name: '编辑', perm: permsMap.point.consume_name.edit },
          { name: '删除', perm: permsMap.point.consume_name.del }
        ]
      }
    ]
  },
  {
    name: '现场',
    children: [{ name: '录入', children: [{ name: '页面', perm: permsMap.scene.enter.view }] }]
  },
  {
    name: '系统管理',
    children: [
      { name: '网站信息', children: [{ name: '页面', perm: permsMap.system_setting.website.view }] },
      { name: '存储设置', children: [{ name: '页面', perm: permsMap.system_setting.storage.view }] },
      { name: '系统日志', children: [{ name: '页面', perm: permsMap.system_setting.log.view }] },
      { name: '系统数据', children: [{ name: '页面', perm: permsMap.system_setting.cache.view }] },
      { name: '系统环境', children: [{ name: '页面', perm: permsMap.system_setting.env.view }] },
      { name: '下载PC', children: [{ name: '页面', perm: permsMap.download.pc.view }] },
      { name: '国际化设置', children: [{ name: '页面', perm: permsMap.system_setting.translate.view }] }
    ]
  },
  {
    name: '会员管理',
    children: [
      {
        name: '列表',
        children: [
          { name: '列表', perm: permsMap.user.list.view },
          { name: '编辑', perm: permsMap.user.list.edit },
          { name: '删除', perm: permsMap.user.list.del },
          { name: '日志', perm: permsMap.user.list.log }
        ]
      },
      {
        name: '等级',
        children: [
          { name: '列表', perm: permsMap.user.level.view },
          { name: '编辑', perm: permsMap.user.level.edit },
          { name: '删除', perm: permsMap.user.level.del }
        ]
      },
      {
        name: '类型',
        children: [
          { name: '列表', perm: permsMap.user.type.view },
          { name: '编辑', perm: permsMap.user.type.edit },
          { name: '删除', perm: permsMap.user.type.del }
        ]
      }
    ]
  },
  // 工作台
  {
    name: '数据看板',
    children: [
      {
        name: '页面',
        children: [{ name: '查看', perm: permsMap.workbench.page.view }]
      }
    ]
  }
];

checkChildren(_permsList, []);

export const permsList = _permsList;

export const permsListMap = mappingArrayToObject(treeToArray(_permsList), 'value');
