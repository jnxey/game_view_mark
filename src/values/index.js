/***************************system**********************************/
import { $t } from '@/lang/i18n';

// 终端terminal；pc
export const SYSTEM_TERMINAL = { terminal: 1, app: 2, member: 4 };

// 超级管理员ROOT
export const SYSTEM_SUPER_ROOT = 1;

// 系统级top父级id
export const SYSTEM_PARENT_TOP = 0;

// 密码正则
export const SYSTEM_PASSWORD_PATTERN = /^(?=.*\S).{6,}$/;

/***************************dict**********************************/

// 全局状态适配
export const STATUS_VALUE = { normal: 0, disable: 1 };

// 全局状态适配-字典
export const STATUS_VALUE_DICT = [
  { name: $t('other.values.status_value_normal'), value: STATUS_VALUE.normal, tag: 'primary' },
  { name: $t('other.values.status_value_disable'), value: STATUS_VALUE.disable, tag: 'danger' }
];

// 全局显示适配
export const SHOW_VALUE = { show: 1, hide: 0 };

// 全局状态适配-字典
export const SHOW_VALUE_DICT = [
  { name: $t('other.values.show_value_show'), value: SHOW_VALUE.show, tag: 'primary' },
  { name: $t('other.values.show_value_hide'), value: SHOW_VALUE.hide, tag: 'info' }
];

// 全局缓存适配
export const CACHE_VALUE = { yes: 1, no: 0 };

// 全局缓存适配-字典
export const CACHE_VALUE_DICT = [
  { name: $t('other.values.cache_value_yes'), value: CACHE_VALUE.yes, tag: 'primary' },
  { name: $t('other.values.cache_value_no'), value: CACHE_VALUE.no, tag: 'info' }
];

// 全局性别适配
export const SEX_VALUE = { man: 1, woman: 2 };

// 全局性别适配-字典
export const SEX_VALUE_DICT = [
  { name: $t('other.values.sex_value_man'), value: SEX_VALUE.man, tag: 'primary' },
  { name: $t('other.values.sex_value_woman'), value: SEX_VALUE.woman, tag: 'warning' }
];

// 全局是否适配
export const YES_NO_VALUE = { yes: 0, no: 1 };

// 全局是否适配-字典
export const YES_NO_VALUE_DICT = [
  { name: $t('other.values.yes_no_value_yes'), value: YES_NO_VALUE.yes, tag: 'primary' },
  { name: $t('other.values.yes_no_value_no'), value: YES_NO_VALUE.no, tag: 'info' }
];

// 全局占股/返点适配-字典，0-普通，1-占股，2-返点，3-按量
export const SHARE_REBATE_VALUE = { ordinary: 0, share: 1, rebate: 2, volume: 3 };

// 全局占股/返点适配-字典
export const SHARE_REBATE_VALUE_DICT = [
  { name: $t('other.values.share_rebate_value_ordinary'), value: SHARE_REBATE_VALUE.ordinary },
  { name: $t('other.values.share_rebate_value_share'), value: SHARE_REBATE_VALUE.share },
  { name: $t('other.values.share_rebate_value_rebate'), value: SHARE_REBATE_VALUE.rebate },
  { name: $t('other.values.share_rebate_value_volume'), value: SHARE_REBATE_VALUE.volume }
];

// 开启关闭适配
export const OPENED_VALUE = { open: 1, close: 0 };

// 开启关闭适配-字典
export const OPENED_VALUE_DICT = [
  { name: $t('other.values.open_value_open'), value: OPENED_VALUE.open, tag: 'primary' },
  { name: $t('other.values.open_value_close'), value: OPENED_VALUE.close, tag: 'danger' }
];

// 币种类型适配
export const CURRENCY_TYPE = { cash: 'cash', chips: 'chips' };

// 币种类型-字典
export const CURRENCY_TYPE_DICT = [
  { name: $t('other.values.currency_type_cash'), value: CURRENCY_TYPE.cash },
  { name: $t('other.values.currency_type_chips'), value: CURRENCY_TYPE.chips }
];

// 洗码方式适配  1-输口，2-赢口，3-双边
export const WASHING_TYPE = { loser: 1, win: 2, bilateral: 3 };

// 洗码方式-字典
export const WASHING_TYPE_DICT = [
  { name: $t('other.values.washing_type_loser'), value: WASHING_TYPE.loser },
  { name: $t('other.values.washing_type_win'), value: WASHING_TYPE.win },
  { name: $t('other.values.washing_type_bilateral'), value: WASHING_TYPE.bilateral }
];

// 消费类型适配  0-分摊，1-公司
export const COST_TYPE = { public: 0, company: 1, member: 2 };

// 消费类型-字典
export const COST_TYPE_DICT = [
  { name: $t('other.values.cost_type_public'), value: COST_TYPE.public },
  { name: $t('other.values.cost_type_company'), value: COST_TYPE.company },
  { name: $t('other.values.cost_type_member'), value: COST_TYPE.member }
];

// 车辆状态适配  0:空闲,1:使用,2:维护,3:停用
export const CAR_STATUS = { free: 0, use: 1, upkeep: 2, blockup: 3 };

// 车辆状态-字典
export const CAR_STATUS_DICT = [
  { name: $t('other.values.car_status_free'), value: CAR_STATUS.free, tag: 'info' },
  { name: $t('other.values.car_status_use'), value: CAR_STATUS.use, tag: 'primary' },
  { name: $t('other.values.car_status_upkeep'), value: CAR_STATUS.upkeep, tag: 'warning' },
  { name: $t('other.values.car_status_blockup'), value: CAR_STATUS.blockup, tag: 'danger' }
];

// 用车记录状态 0派车中，1派车结束
export const CAR_RECORD_STATUS = { ing: 0, finish: 1 };

// 车辆状态-字典
export const CAR_RECORD_STATUS_DICT = [
  { name: $t('other.values.car_record_status_ing'), value: CAR_RECORD_STATUS.ing, tag: 'warning' },
  { name: $t('other.values.car_record_status_finish'), value: CAR_RECORD_STATUS.finish, tag: 'info' }
];

// 车辆状态适配 0:已结束;1:保养中
export const CAR_MAINTAIN_STATUS = { finish: 0, ing: 1 };

// 车辆状态-字典
export const CAR_MAINTAIN_STATUS_DICT = [
  { name: $t('other.values.car_maintain_finish'), value: CAR_MAINTAIN_STATUS.finish, tag: 'info' },
  { name: $t('other.values.car_maintain_ing'), value: CAR_MAINTAIN_STATUS.ing, tag: 'warning' }
];

// 房间状态适配  0:空闲,1:使用,2:维护,3:停用
export const ROOM_STATUS = { free: 0, use: 1, upkeep: 2, blockup: 3 };

// 房间状态-字典
export const ROOM_STATUS_DICT = [
  { name: $t('other.values.room_status_free'), value: ROOM_STATUS.free, tag: 'info' },
  { name: $t('other.values.room_status_use'), value: ROOM_STATUS.use, tag: 'primary' },
  { name: $t('other.values.room_status_upkeep'), value: ROOM_STATUS.upkeep, tag: 'warning' },
  { name: $t('other.values.room_status_blockup'), value: ROOM_STATUS.blockup, tag: 'danger' }
];

// 房间入住状态适配  0:在住,1:已退房
export const ROOM_CHECK_STATUS = { in: 0, out: 1 };

// 房间状态-字典
export const ROOM_CHECK_STATUS_DICT = [
  { name: $t('other.values.room_check_status_in'), value: ROOM_CHECK_STATUS.in, tag: 'primary' },
  { name: $t('other.values.room_check_status_out'), value: ROOM_CHECK_STATUS.out, tag: 'info' }
];

// 客人类型适配  0:普通客人,1:公司玩家
export const GUEST_TYPE = { normal: 0, member: 1 };

// 客人类型-字典
export const GUEST_TYPE_DICT = [
  { name: $t('other.values.guest_type_normal'), value: GUEST_TYPE.normal, tag: 'info' },
  { name: $t('other.values.guest_type_member'), value: GUEST_TYPE.member, tag: 'primary' }
];

// 积分操作类型适配  1：充值，2：消费，3：过期，4：扣除
export const POINTS_HANDLER = { ins: 1, consume: 2, expire: 3, dec: 4 };

// 积分操作类型-字典
export const POINTS_HANDLER_DICT = [
  { name: $t('other.values.points_handler_ins'), value: POINTS_HANDLER.ins, tag: 'primary' },
  { name: $t('other.values.points_handler_consume'), value: POINTS_HANDLER.consume, tag: 'info' },
  { name: $t('other.values.points_handler_expire'), value: POINTS_HANDLER.expire, tag: 'info' },
  { name: $t('other.values.points_handler_dec'), value: POINTS_HANDLER.dec, tag: 'info' }
];

// 游戏模型
export const GAME_MODEL = { baccarat: 1, niu_niu: 2, long_hu: 3, general: 99 };

// 投注项结果 游戏模型判断依据
export const GAME_MODEL_TYPE_BACCARAT = [GAME_MODEL.baccarat, GAME_MODEL.long_hu];

// 座位结果 游戏模型判断依据
export const GAME_MODEL_TYPE_GENERAL = [GAME_MODEL.niu_niu, GAME_MODEL.general];

// 游戏模型-字典
export const GAME_MODEL_DICT = [
  { name: $t('other.values.game_model_baccarat'), value: GAME_MODEL.baccarat },
  { name: $t('other.values.game_model_model_long_hu'), value: GAME_MODEL.long_hu },
  { name: $t('other.values.game_model_model_niu'), value: GAME_MODEL.niu_niu },
  { name: $t('other.values.game_model_general'), value: GAME_MODEL.general }
];

// 投注项 级别适配
export const GAME_KIND_LEVEL = { top: 0, sub: 1 };

// 投注项 级别适配-字典
export const GAME_KIND_LEVEL_DICT = [
  { name: $t('other.values.game_kind_level_top'), value: GAME_KIND_LEVEL.top },
  { name: $t('other.values.game_kind_level_sub'), value: GAME_KIND_LEVEL.sub }
];

// 投注项 赔率计算适配
export const GAME_KIND_CALC = { self: 0, sub: 1 };

// 投注项 赔率计算适配-字典
export const GAME_KIND_CALC_DICT = [
  { name: $t('other.values.game_kind_calc_self'), value: GAME_KIND_CALC.self },
  { name: $t('other.values.game_kind_calc_sub'), value: GAME_KIND_CALC.sub }
];

// 投注项 位置适配
export const GAME_KIND_POSITION = { main: 0, leftTop: 1, leftBottom: 3, rightTop: 2, rightBottom: 4 };

// 投注项 位置适配-字典
export const GAME_KIND_POSITION_DICT = [
  { name: $t('other.values.game_kind_position_main'), value: GAME_KIND_POSITION.main, class: 'main' },
  { name: $t('other.values.game_kind_position_left_top'), value: GAME_KIND_POSITION.leftTop, class: 'left-top', icon: 'local-icon-react-left-top' },
  {
    name: $t('other.values.game_kind_position_left_bottom'),
    value: GAME_KIND_POSITION.leftBottom,
    class: 'left-bottom',
    icon: 'local-icon-react-left-bottom'
  },
  {
    name: $t('other.values.game_kind_position_right_top'),
    value: GAME_KIND_POSITION.rightTop,
    class: 'right-top',
    icon: 'local-icon-react-right-top'
  },
  {
    name: $t('other.values.game_kind_position_right_bottom'),
    value: GAME_KIND_POSITION.rightBottom,
    class: 'right-bottom',
    icon: 'local-icon-react-right-bottom'
  }
];

// 投注项 杀码类型-适配
export const GAME_KILL_TYPE = { all: 0, half: 1, zero: 2 };

// 投注项 杀码类型-字典
export const GAME_KILL_TYPE_DICT = [
  { name: $t('other.values.game_kill_type_all'), value: GAME_KILL_TYPE.all },
  { name: $t('other.values.game_kill_type_half'), value: GAME_KILL_TYPE.half },
  { name: $t('other.values.game_kill_type_zero'), value: GAME_KILL_TYPE.zero }
];

// 投注项 赔码类型-适配
export const GAME_COMPENSATION_TYPE = { all: 0, half: 1 };

// 投注项 赔码类型-字典
export const GAME_COMPENSATION_TYPE_DICT = [
  { name: $t('other.values.game_compensation_type_all'), value: GAME_COMPENSATION_TYPE.all },
  { name: $t('other.values.game_compensation_type_half'), value: GAME_COMPENSATION_TYPE.half }
];

// 投注项 保险绑定-适配
export const GAME_INSURANCE_TYPE = { insurance: 0, normal: 1 };

// 投注项 保险绑定-字典
export const GAME_INSURANCE_TYPE_DICT = [
  { name: $t('other.values.game_insurance_type_normal'), value: GAME_INSURANCE_TYPE.normal },
  { name: $t('other.values.game_insurance_type_insurance'), value: GAME_INSURANCE_TYPE.insurance }
];

// 投注项 大屏路单结果标识
export const GAME_KIND_MARK = { master: 'master', player: 'player', draw: 'draw' };

// 投注项 大屏路单结果标识-字典
export const GAME_KIND_MARK_DICT = [
  { name: $t('other.values.game_kind_mark_master'), value: GAME_KIND_MARK.master, color: 'red' },
  { name: $t('other.values.game_kind_mark_player'), value: GAME_KIND_MARK.player, color: 'blue' },
  { name: $t('other.values.game_kind_mark_draw'), value: GAME_KIND_MARK.draw, color: 'green' }
];

// 问路类型
export const GAME_ASK_WAY_TYPE = {
  regularly: { name: $t('other.values.game_ask_way_type_regularly'), color: 'red', value: 'regularly' },
  confused: { name: $t('other.values.game_ask_way_type_confused'), color: 'blue', value: 'confused' }
};

// 商品订单状态适配
export const STOCK_ORDER_STATUS = { process: 0, success: 1, cancel: 2 };

// 全局状态适配-字典
export const STOCK_ORDER_STATUS_DICT = [
  { name: $t('other.values.stock_order_status_process'), value: STOCK_ORDER_STATUS.process, tag: 'warning' },
  { name: $t('other.values.stock_order_status_success'), value: STOCK_ORDER_STATUS.success, tag: 'success' },
  { name: $t('other.values.stock_order_status_cancel'), value: STOCK_ORDER_STATUS.cancel, tag: 'info' }
];

// 交易类型适配
export const STOCK_ORDER_TYPE = { currency: 0, integral: 1 };

// 交易类型适配-字典
export const STOCK_ORDER_TYPE_DICT = [
  { name: $t('other.values.stock_order_type_currency'), value: STOCK_ORDER_TYPE.currency },
  { name: $t('other.values.stock_order_type_integral'), value: STOCK_ORDER_TYPE.integral }
];

// 皮肤类型适配
export const LAYOUT_SKIN_TYPE = { themeLight: 'theme-light', themeWarm: 'theme-warm', themeDark: 'theme-dark' };

// 皮肤类型适配-字典
export const LAYOUT_SKIN_TYPE_DICT = [
  { name: $t('other.values.layout_skin_type_theme_light'), value: LAYOUT_SKIN_TYPE.themeLight, bgColor: '#ffffff' },
  { name: $t('other.values.layout_skin_type_theme_warm'), value: LAYOUT_SKIN_TYPE.themeWarm, bgColor: '#efe8dd' },
  { name: $t('other.values.layout_skin_type_theme_dark'), value: LAYOUT_SKIN_TYPE.themeDark, bgColor: '#141414' }
];

// 皮肤主题色适配
export const LAYOUT_SKIN_COLOR = {
  blue: 'primary-blue',
  red: 'primary-red',
  orange: 'primary-orange',
  gold: 'primary-gold',
  green: 'primary-green',
  purple: 'primary-purple'
};

// 皮肤主题色适配-字典
export const LAYOUT_SKIN_COLOR_DICT = [
  { name: $t('other.values.color_blue'), value: LAYOUT_SKIN_COLOR.blue, color: '#409eff' },
  { name: $t('other.values.color_red'), value: LAYOUT_SKIN_COLOR.red, color: '#F53F3F' },
  { name: $t('other.values.color_orange'), value: LAYOUT_SKIN_COLOR.orange, color: '#FF7D00' },
  { name: $t('other.values.color_gold'), value: LAYOUT_SKIN_COLOR.gold, color: '#F7BA1E' },
  { name: $t('other.values.color_green'), value: LAYOUT_SKIN_COLOR.green, color: '#00B42A' },
  { name: $t('other.values.color_purple'), value: LAYOUT_SKIN_COLOR.purple, color: '#683df5' }
];

// 游戏本靴进行状态
export const GAME_BOOT_STATUS = { process: 0, finish: 1 };

// 游戏本靴进行状态-字典
export const GAME_BOOT_STATUS_DICT = [
  { name: $t('other.values.game_boot_status_process'), value: GAME_BOOT_STATUS.process, tag: 'warning' },
  { name: $t('other.values.game_boot_status_finish'), value: GAME_BOOT_STATUS.finish, tag: 'success' }
];

// 数字操作类型，增加 inc+，减少 dec-
export const NUMBER_HANDLER = { inc: 'inc', dec: 'dec' };

// 操作类型，inc+，dec-
export const NUMBER_HANDLER_DICT = [
  { name: $t('other.values.humber_handler_inc'), value: NUMBER_HANDLER.inc, color: '#409eff' },
  { name: $t('other.values.humber_handler_dec'), value: NUMBER_HANDLER.dec, color: '#FF7D00' }
];

// 操作记录-操作类型
export const LOG_OPERATOR_TYPE = { add: 'add', update: 'update', delete: 'delete' };

// 操作记录-操作类型-字典
export const LOG_OPERATOR_TYPE_DICT = [
  { name: $t('other.values.log_operator_type_add'), value: LOG_OPERATOR_TYPE.add, tag: 'primary' },
  { name: $t('other.values.log_operator_type_update'), value: LOG_OPERATOR_TYPE.update, tag: 'warning' },
  { name: $t('other.values.log_operator_type_delete'), value: LOG_OPERATOR_TYPE.delete, tag: 'danger' }
];

// 输赢适配
export const LOSS_WIN_VALUE = { win: 0, loss: 1 };

// 输赢适配-字典
export const LOSS_WIN_VALUE_DICT = [
  { name: $t('other.values.loss_win_value_win'), value: LOSS_WIN_VALUE.win, tag: 'success' },
  { name: $t('other.values.loss_win_value_loss'), value: LOSS_WIN_VALUE.loss, tag: 'danger' }
];

// 是否收码
export const IS_CLOSE_BET = { no: 1, yes: 2 };

// 是否收码-字典
export const IS_CLOSE_BET_DICT = [
  { name: $t('other.values.is_close_bet_no'), value: IS_CLOSE_BET.no, tag: 'info' },
  { name: $t('other.values.is_close_bet_yes'), value: IS_CLOSE_BET.yes, tag: 'primary' }
];

// 录像机品牌
export const VIDEO_RECORDER_VALUE = { HIKVision: 'HIKVision' };

// 录像机品牌-字典
export const VIDEO_RECORDER_VALUE_DICT = [{ name: 'HIKVision', value: VIDEO_RECORDER_VALUE.HIKVision }];

// 是否收码
export const CODE_WASH_CHANGE_TYPE = { enter: 0, modify: 1, gwm: 2, settle: 10 };

// 是否收码-字典
export const CODE_WASH_CHANGE_TYPE_DICT = [
  { name: $t('other.values.code_wash_change_type_enter'), value: CODE_WASH_CHANGE_TYPE.enter, color: '#409eff' },
  { name: $t('other.values.code_wash_change_type_modify'), value: CODE_WASH_CHANGE_TYPE.modify, color: '#fa670c' },
  { name: $t('other.values.code_wash_change_type_gwm'), value: CODE_WASH_CHANGE_TYPE.gwm, color: '#a57f03' },
  { name: $t('other.values.code_wash_change_type_settle'), value: CODE_WASH_CHANGE_TYPE.settle, color: '#5ba101' }
];

// 是否是会员
export const IS_MEMBER = { inset: 1, outset: 20 };

// 是否收码-字典
export const IS_MEMBER_DICT = [
  { name: $t('other.values.yes_no_value_yes'), value: IS_MEMBER.inset },
  { name: $t('other.values.yes_no_value_no'), value: IS_MEMBER.outset }
];

/***************************request**********************************/

// 是否多处登录
export const LOGIN_MUTI_VALUE = { yes: 1, no: 0 };

// 列表请求类型
export const QUERY_LIST_TYPE = { all: 0, pager: 1 };

// 列表请求的最大数
export const QUERY_LIST_MAX_NUMBER = 1000;

// 列表请求排序类型 ELEMENT_SORT,QUERY_LIST_SORT属性需同步
export const ELEMENT_SORT = { descending: 'descending', ascending: 'ascending' };

// Element排序类型 ELEMENT_SORT,QUERY_LIST_SORT属性需同步
export const QUERY_LIST_SORT = { descending: 'desc', ascending: 'asc' };

// 列表请求默认大小
export const QUERY_LIST_SIZE = 20;

// 全局操作类型
export const OPERATE_TYPE = { insert: 'insert', update: 'update', delete: 'delete', view: 'view' };

// 请求返回 code
export const RESPONSE_CODE = { SUCCESS: 1, FAIL: 0, LOGIN_FAILURE: -1, OPEN_NEW_PAGE: 2 };

/***************************layout**********************************/
// 顶部高度
export const LAYOUT_HEADER_HEIGHT = 60;

//  菜单宽度
export const LAYOUT_MENU_WIDTH = 220;

// 菜单宽度_关闭
export const LAYOUT_MENU_WIDTH_COLLAPSE = 64;

/***************************other**********************************/

// 文本域默认配置
export const TEXTAREA_CONFIG = { minRows: 4, maxRows: 6 };

// 用户树-全部key
export const USER_TREE_ALL_KEY = '';

// 数据权限范围 all,7days,15days,30days,90days,this_month,custom
export const PERMS_DATA_CUSTOM = 'custom';
export const PERMS_DATA_RANGE = [
  { name: $t('other.values.perms_data_range_all'), value: 'all' },
  { name: $t('other.values.perms_data_range_7days'), value: '7days' },
  { name: $t('other.values.perms_data_range_15days'), value: '15days' },
  { name: $t('other.values.perms_data_range_30days'), value: '30days' },
  { name: $t('other.values.perms_data_range_90days'), value: '90days' },
  { name: $t('other.values.perms_data_range_this_month'), value: 'this_month' },
  { name: $t('other.values.perms_data_range_custom'), value: 'custom' }
];

// 常规柜子类型id
export const REGULAR_CABINET_TYPE_IDS = {
  code_washing: 1, // 洗码柜子
  deposit: 2, // 寄存
  sign: 3, // 签单
  buy: 4, // 买码换现柜子
  score: 5, // 上下分
  exchange: 6, // 货币兑换柜子
  remit: 7 // 汇款柜子
};

// 国际化词条类型
export const GV_INPUT_LANGUAGE_TYPE = {
  user_level: 1,
  user_type: 2,
  game_name: 3,
  game_kind_name: 4,
  bonus_list_name: 5,
  bonus_config_name: 6,
  table_type_name: 7,
  cabinet_chip_type_name: 8,
  currency_base_name: 9,
  currency_config_name: 10,
  remit_type_name: 11,
  staff_admin_education: 12,
  perms_role_name: 13,
  perms_data_name: 14,
  org_department_name: 15,
  org_job_name: 16,
  external_consume_type: 17,
  translate: 999
};

// 日志信息账号类型
export const LOG_ACCOUNT_TYPE = {
  system: 1,
  external: 20
};

// 会员等级颜色
export const LEVEL_COLOR_MAP = {
  0: '#6e0202',
  1: '#bf0202',
  2: '#ca8403',
  3: '#008000',
  4: '#01cccc',
  5: '#0a0ac3',
  6: '#710171'
};

// 现场录入有的座位号
export const SCENE_SEATS = [1, 2, 3, 5, 6, 7];
