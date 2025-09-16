import { bonusDiyUISet, bonusListDel, bonusListSet, bonusListStatus } from './bouns/list';
import { bounsConfigDel, bounsConfigSet, bounsConfigStatus } from '@/api/bouns/config';
import { currencyConfigDel, currencyConfigSet, currencyConfigStatus } from '@/api/currency/config';
import { currencyBaseDel, currencyBaseLists, currencyBaseSet } from '@/api/currency/base';
import { currencyChipLists } from '@/api/currency/chip';
import { externalCostsDel, externalCostsLists, externalCostsLog, externalCostsSet } from '@/api/external/costs';
import { externalConsumeTypeDel, externalConsumeTypeLog, externalConsumeTypeSet } from '@/api/external/consume-type';
import {
  carAdministerDel,
  carAdministerEnd,
  carAdministerLists,
  carAdministerLog,
  carAdministerSet,
  carAdministerStart
} from '@/api/external/car-administer';
import { carRecordLists, carRecordLog, carRecordSet } from '@/api/external/car-record';
import { carMaintainCreate, carMaintainLists, carMaintainLog, carMaintainSet } from '@/api/external/car-maintain';
import {
  hotelManagementCheckContinue,
  hotelManagementCheckIn,
  hotelManagementCheckOut,
  hotelManagementDel,
  hotelManagementLists,
  hotelManagementLog,
  hotelManagementSet
} from '@/api/external/hotel-management';
import { hotelRoomRecordDel, hotelRoomRecordLists, hotelRoomRecordLog, hotelRoomRecordSet } from '@/api/external/hotel-room-record';
import { hotelRoomTypeDel, hotelRoomTypeLists, hotelRoomTypeLog, hotelRoomTypeSet } from '@/api/external/hotel-room-type';
import { financeTransfer, financeUserChipClear, financeUserChipLists, financeUserChipSet, financeUserLog } from '@/api/finance/user-chip';
import { financeCabinetChipLists, financeCabinetChipSetAmount } from '@/api/finance/cabinet-chip';
import { financeCurrencyExchangeLists, financeCurrencyExchangeSet } from '@/api/finance/currency-exchange';
import {
  financeTableBindCamera,
  financeTableDel,
  financeTableIncDec,
  financeTableLastLog,
  financeTableSet,
  financeTableSetCashStatus,
  financeTableSetStatus,
  financeTableSetUserCabinet,
  financeTableUnbindDevice
} from '@/api/finance/table';
import { financeTipDel, financeTipLists, financeTipLog, financeTipSet } from '@/api/finance/tip';
import { financeCabinetChipTypeDel, financeCabinetChipTypeSet } from '@/api/finance/cabinet-chip-type';
import { financeTableTypeDel, financeTableTypeSet } from '@/api/finance/table-type';
import {
  financeBetCommissionDetail,
  financeCodeWashingList,
  financeCodeWashingSettler,
  financeCodeWashingSettlerLog
} from '@/api/finance/code-washing';
import { gameConfigGetDetection, gameConfigPreDetection, gameConfigSet, gameDel, gameLastLog, gameSet, gameStatus } from '@/api/game/list';
import { gameKindComposeSet, gameKindDel, gameKindLastLog, gameKindSet } from '@/api/game/kind';
import { gameChipDel, gameChipSet } from '@/api/game/chip';
import { betOpenLists, betOpenLog, betOpenSet } from '@/api/game-data/bet-open';
import { betActionLog, betBonusGwm, betBonusList, betBonusModify, betGetBetWithOpenId, betGwm, betLists, betModify } from '@/api/game-data/bet';
import { riskBetLists, riskCurrencyConfigLists, riskCurrencyConfigTableLists, riskTableLists } from '@/api/game-data/risk';
import { reportUserIncomeSettler, reportUserIncomeSettlerLog, reportUserLists } from '@/api/report/user';
import { reportTableLists } from '@/api/report/table';
import { reportDayLists } from '@/api/report/day';
import { reportMonthLists } from '@/api/report/month';
import {
  reportCloseDetail,
  reportCheckIncDecLog,
  reportGameCheckGet,
  reportGameCheckGetDetail,
  reportGameCheckList,
  reportGameCheckSet,
  reportGameCloseList,
  reportGetCloseBind,
  reportSetCloseBind,
  reportGameCloseGet,
  reportGameCloseSet
} from '@/api/report/game-check';
import { storeDel, storeSet, storeStatus } from '@/api/goods/store';
import { stockDel, stockExchangeStatus, stockLists, stockSet, stockStatus } from '@/api/goods/stock';
import { stockOrderLists, stockOrderLog, stockOrderSet, stockOrderStatus } from '@/api/goods/stock-order';
import { stockSetNumber, stockTypeDel, stockTypeSet } from '@/api/goods/stock-type';
import { deptAdd, deptDelete, deptEdit } from '@/api/org/department';
import { jobsAdd, jobsDelete, jobsEdit } from '@/api/org/job';
import { adminAdd, adminDelete, adminDetail, adminEdit, adminLists, adminSetPassword } from '@/api/staff/admin';
import { staffBuildingDel, staffBuildingSet } from '@/api/staff/building';
import { staffApartmentDel, staffApartmentLists, staffApartmentSet } from '@/api/staff/apartment';
import { staffApartmentAdminDel, staffApartmentAdminLists, staffApartmentAdminSet } from '@/api/staff/apartment-admin';
import { menuAdd, menuDelete, menuDetail, menuEdit, menuLists } from '@/api/perms/menu';
import { roleAdd, roleDataPermsAssign, roleDataPermsDel, roleDataPermsSet, roleDelete, roleDetail, roleEdit, roleLists } from '@/api/perms/role';
import { pointsSummaryDeduct, pointsSummaryLists, pointsSummarySet, pointsSummarySetExpire } from '@/api/points/summary';
import { pointsDetailLists } from '@/api/points/detail';
import { pointsConsumeNameDel, pointsConsumeNameLists, pointsConsumeNameSet } from '@/api/points/consume-name';
import {
  betBootNumber,
  betDetailByBootNumber,
  betNextBootNumber,
  betOpenBootNumber,
  sceneBettingBalance,
  sceneBettingOpening,
  sceneBettingSet,
  sceneEnterInfo
} from '@/api/scene/enter';
import { getWebsite, setWebsite } from '@/api/setting/website';
import { storageChange, storageDetail, storageLists, storageSetup } from '@/api/setting/storage';
import { systemCacheClear, systemChoiceClearData, systemClearData, systemInfo, systemLogLists } from '@/api/setting/system';
import { userDelete, userDetail, userEditAttr, userLastLog, userLists, userSet, userSetPassword, userSwitchButton } from '@/api/user/list';
import { userLevelAdd, userLevelDel, userLevelEdit } from '@/api/user/level';
import { userTypeAdd, userTypeDel, userTypeEdit } from '@/api/user/type';
import { getWorkbench, toolsChatPinnedMessage, toolsChatSendMessage, toolsChatUnpinnedMessage } from '@/api/common';
import { financeRemitTypeDel, financeRemitTypeSet } from '@/api/finance/remit-type';
import { financeCameraDel, financeCameraSet } from '@/api/finance/video-recorder';

const getPermsCompose = (list) => list.join(',');

export const permsMap = {
  // 布局
  layout: {
    // 广播室
    chat_send: getPermsCompose(['erp_layout_chat_send', toolsChatSendMessage.perm]),
    chat_top: getPermsCompose(['erp_layout_chat_top', toolsChatPinnedMessage.perm]),
    chat_top_cancel: getPermsCompose(['erp_layout_chat_top_cancel', toolsChatUnpinnedMessage.perm])
  },
  // 彩金管理
  bonus: {
    // 彩金类型
    list: {
      view: getPermsCompose(['erp_bonus_list_view']),
      edit: getPermsCompose(['erp_bonus_list_edit', bonusListSet.perm, bonusListStatus.perm]),
      del: getPermsCompose(['erp_bonus_list_del', bonusListDel.perm])
    },
    // 彩金奖项
    config: {
      view: getPermsCompose(['erp_bonus_config_view']),
      edit: getPermsCompose(['erp_bonus_config_edit', bounsConfigSet.perm, bounsConfigStatus.perm]),
      del: getPermsCompose(['erp_bonus_config_del', bounsConfigDel.perm])
    },
    // 彩金大屏设置
    desk: {
      view: getPermsCompose(['erp_bonus_desk_view', bonusDiyUISet.perm])
    }
  },
  // 大屏
  desk: {
    // 路单
    road: { view: getPermsCompose(['erp_desk_road_view']) },
    // 彩金
    bonus: { view: getPermsCompose(['erp_desk_bonus_view']) },
    // 游戏大屏
    main: { view: getPermsCompose(['erp_desk_main_view']) }
  },
  // 货币管理
  currency: {
    // 币种设置
    config: {
      view: getPermsCompose(['erp_currency_config_view']),
      edit: getPermsCompose(['erp_currency_config_edit', currencyConfigSet.perm, currencyConfigStatus.perm]),
      del: getPermsCompose(['erp_currency_config_del', currencyConfigDel.perm])
    },
    // 基础货币
    base: {
      view: getPermsCompose(['erp_currency_base_view', currencyBaseLists.perm]),
      edit: getPermsCompose(['erp_currency_base_edit', currencyBaseSet.perm]),
      del: getPermsCompose(['erp_currency_base_del', currencyBaseDel.perm])
    },
    // C码详情
    chip: {
      view: getPermsCompose(['erp_currency_chip_view', currencyChipLists.perm])
    }
  },
  // 下载页
  download: {
    // PC端
    pc: {
      view: getPermsCompose(['erp_download_pc_view'])
    }
  },
  // 外联管理
  external: {
    // 支出费用
    costs: {
      view: getPermsCompose(['erp_external_costs_view', externalCostsLists.perm]),
      edit: getPermsCompose(['erp_external_costs_edit', externalCostsSet.perm]),
      del: getPermsCompose(['erp_external_costs_del', externalCostsDel.perm]),
      log: getPermsCompose(['erp_external_costs_log', externalCostsLog.perm])
    },
    // 消费项目
    consume_type: {
      view: getPermsCompose(['erp_external_consume_type_view']),
      edit: getPermsCompose(['erp_external_consume_type_edit', externalConsumeTypeSet.perm]),
      del: getPermsCompose(['erp_external_consume_type_del', externalConsumeTypeDel.perm]),
      log: getPermsCompose(['erp_external_consume_type_log', externalConsumeTypeLog.perm])
    },
    // 车辆管理
    car_administer: {
      view: getPermsCompose(['erp_external_car_administer_view', carAdministerLists.perm]),
      edit: getPermsCompose(['erp_external_car_administer_edit', carAdministerSet.perm]),
      del: getPermsCompose(['erp_external_car_administer_del', carAdministerDel.perm]),
      start: getPermsCompose(['erp_external_car_administer_start', carAdministerStart.perm]),
      end: getPermsCompose(['erp_external_car_administer_end', carAdministerEnd.perm]),
      maintain: getPermsCompose(['erp_external_car_administer_maintain', carMaintainCreate.perm]),
      log: getPermsCompose(['erp_external_car_administer_log', carAdministerLog.perm])
    },
    // 用车记录
    car_record: {
      view: getPermsCompose(['erp_external_car_record_view', carRecordLists.perm]),
      edit: getPermsCompose(['erp_external_car_record_edit', carRecordSet.perm]),
      log: getPermsCompose(['erp_external_car_record_log', carRecordLog.perm])
    },
    // 车辆保养
    car_maintain: {
      view: getPermsCompose(['erp_external_car_maintain_view', carMaintainLists.perm]),
      edit: getPermsCompose(['erp_external_car_maintain_edit', carMaintainSet.perm]),
      log: getPermsCompose(['erp_external_car_maintain_log', carMaintainLog.perm])
    },
    // 酒店管理
    hotel_management: {
      view: getPermsCompose(['erp_external_hotel_management_view', hotelManagementLists.perm]),
      edit: getPermsCompose(['erp_external_hotel_management_edit', hotelManagementSet.perm]),
      del: getPermsCompose(['erp_external_hotel_management_del', hotelManagementDel.perm]),
      start: getPermsCompose(['erp_external_hotel_management_start', hotelManagementCheckIn.perm]),
      end: getPermsCompose(['erp_external_hotel_management_end', hotelManagementCheckOut.perm]),
      continue: getPermsCompose(['erp_external_hotel_management_continue', hotelManagementCheckContinue.perm]),
      log: getPermsCompose(['erp_external_hotel_management_log', hotelManagementLog.perm])
    },
    // 开房记录
    hotel_room_record: {
      view: getPermsCompose(['erp_external_hotel_room_record_view', hotelRoomRecordLists.perm, hotelRoomTypeLists.perm]),
      edit: getPermsCompose(['erp_external_hotel_room_record_edit', hotelRoomRecordSet.perm]),
      del: getPermsCompose(['erp_external_hotel_room_record_del', hotelRoomRecordDel.perm]),
      log: getPermsCompose(['erp_external_hotel_room_record_log', hotelRoomRecordLog.perm])
    },
    // 房间类型
    hotel_room_type: {
      view: getPermsCompose(['erp_external_hotel_room_type_view']),
      edit: getPermsCompose(['erp_external_hotel_room_type_edit', hotelRoomTypeSet.perm]),
      del: getPermsCompose(['erp_external_hotel_room_type_del', hotelRoomTypeDel.perm]),
      log: getPermsCompose(['erp_external_hotel_room_type_log', hotelRoomTypeLog.perm])
    }
  },
  // 素材管理
  material: {
    // 素材中心
    center: {
      view: getPermsCompose(['erp_material_center_view'])
    }
  },
  // 财务管理
  finance: {
    // 码房管理
    user_chip: {
      view: getPermsCompose(['erp_finance_user_chip_view', financeUserChipLists.perm, financeCabinetChipLists.perm]),
      edit: getPermsCompose([
        'erp_finance_user_chip_edit',
        financeUserChipSet.perm,
        financeUserChipClear.perm,
        financeTransfer.perm,
        financeCabinetChipSetAmount.perm
      ]),
      log: getPermsCompose(['erp_finance_user_chip_log', financeUserLog.perm])
    },
    // 台号管理
    table: {
      view: getPermsCompose(['erp_finance_table_view']),
      edit: getPermsCompose([
        'erp_finance_table_edit',
        financeTableSet.perm,
        financeTableSetStatus.perm,
        financeTableSetCashStatus.perm,
        financeTableUnbindDevice.perm,
        financeTableBindCamera.perm
      ]),
      del: getPermsCompose(['erp_finance_table_del', financeTableDel.perm]),
      log: getPermsCompose(['erp_finance_table_log', financeTableLastLog.perm])
    },
    // 小费管理
    tip: {
      view: getPermsCompose(['erp_finance_tip_view', financeTipLists.perm]),
      edit: getPermsCompose(['erp_finance_tip_edit', financeTipSet.perm]),
      del: getPermsCompose(['erp_finance_tip_del', financeTipDel.perm]),
      log: getPermsCompose(['erp_finance_tip_log', financeTipLog.perm])
    },
    // 柜子类型
    cabinet_type: {
      view: getPermsCompose(['erp_finance_cabinet_type_view']),
      edit: getPermsCompose(['erp_finance_cabinet_type_edit', financeCabinetChipTypeSet.perm]),
      del: getPermsCompose(['erp_finance_cabinet_type_del', financeCabinetChipTypeDel.perm])
    },
    // 货币兑换
    exchange: {
      view: getPermsCompose(['erp_finance_cabinet_type_view', financeCurrencyExchangeLists.perm]),
      edit: getPermsCompose(['erp_finance_cabinet_type_edit', financeCurrencyExchangeSet.perm])
    },
    // 台号类型
    table_type: {
      view: getPermsCompose(['erp_finance_table_type_view']),
      edit: getPermsCompose(['erp_finance_table_type_edit', financeTableTypeSet.perm]),
      del: getPermsCompose(['erp_finance_table_type_del', financeTableTypeDel.perm])
    },
    // 洗码结算
    code_washing: {
      // view: getPermsCompose(['erp_finance_code_washing_view', financeCodeWashingList.perm]),
      settler: getPermsCompose(['erp_finance_code_washing_settler', financeCodeWashingSettler.perm]),
      bet: getPermsCompose(['erp_finance_code_washing_bet', financeBetCommissionDetail.perm]),
      log: getPermsCompose(['erp_finance_code_washing_log', financeCodeWashingSettlerLog.perm])
    },
    // 汇款类型
    remit_type: {
      view: getPermsCompose(['erp_finance_remit_type_view']),
      edit: getPermsCompose(['erp_finance_remit_type_edit', financeRemitTypeSet.perm]),
      del: getPermsCompose(['erp_finance_remit_type_del', financeRemitTypeDel.perm])
    },
    // 录像机
    video_recorder: {
      view: getPermsCompose(['erp_finance_video_recorder_view']),
      edit: getPermsCompose(['erp_finance_video_recorder_edit', financeCameraSet.perm]),
      del: getPermsCompose(['erp_finance_video_recorder_del', financeCameraDel.perm])
    }
  },
  // 游戏管理
  game: {
    // 游戏列表
    list: {
      view: getPermsCompose(['erp_game_list_view']),
      edit: getPermsCompose(['erp_game_list_edit', gameSet.perm, gameStatus.perm, gameConfigSet.perm]),
      check: getPermsCompose(['erp_game_list_check', gameConfigPreDetection.perm, gameConfigGetDetection.perm]),
      del: getPermsCompose(['erp_game_list_del', gameDel.perm]),
      log: getPermsCompose(['erp_game_list_log', gameLastLog.perm])
    },
    // 投注项
    kind: {
      view: getPermsCompose(['erp_game_kind_view']),
      edit: getPermsCompose(['erp_game_kind_edit', gameKindSet.perm, gameKindComposeSet.perm]),
      del: getPermsCompose(['erp_game_kind_del', gameKindDel.perm]),
      log: getPermsCompose(['erp_game_Kind_log', gameKindLastLog.perm])
    },
    // 点码配置
    chip: {
      view: getPermsCompose(['erp_game_chip_view']),
      edit: getPermsCompose(['erp_game_chip_edit', gameChipSet.perm]),
      del: getPermsCompose(['erp_game_chip_del', gameChipDel.perm]),
      bind: getPermsCompose(['erp_game_chip_close_bind', reportGetCloseBind.perm, reportSetCloseBind.perm])
    }
  },
  // 游戏数据
  game_data: {
    // 点码配置
    bet_open: {
      view: getPermsCompose(['erp_game_data_bet_open_view', betOpenLists.perm]),
      edit: getPermsCompose(['erp_game_data_bet_open_edit', betOpenSet.perm]),
      log: getPermsCompose(['erp_game_data_bet_open_log', betOpenLog.perm])
    },
    // 会员注单
    bet: {
      view: getPermsCompose(['erp_game_data_bet_view', betLists.perm]),
      edit: getPermsCompose(['erp_game_data_bet_edit', betModify.perm, betGwm.perm]),
      log: getPermsCompose(['erp_game_data_bet_log', betActionLog.perm]),
      bonus: getPermsCompose(['erp_game_data_bet_bonus', betBonusList.perm])
    },
    // 风险控制
    risk: {
      view: getPermsCompose([
        'erp_game_data_risk_view',
        riskTableLists.perm,
        riskBetLists.perm,
        riskCurrencyConfigLists.perm,
        riskCurrencyConfigTableLists.perm
      ])
    }
  },
  // 盈亏报表
  report: {
    // 会员盈亏
    user: {
      view: getPermsCompose(['erp_report_user_view', reportUserLists.perm]),
      settler: getPermsCompose(['erp_report_user_settler', reportUserIncomeSettler.perm]),
      settler_log: getPermsCompose(['erp_report_user_settler_log', reportUserIncomeSettlerLog.perm])
    },
    // 台面盈亏
    table: {
      view: getPermsCompose(['erp_report_table_view', reportTableLists.perm])
    },
    // 每日盈亏
    day: {
      view: getPermsCompose(['erp_report_day_view', reportDayLists.perm])
    },
    // 每月盈亏
    month: {
      view: getPermsCompose(['erp_report_month_view', reportMonthLists.perm])
    },
    // 点码
    check: {
      view: getPermsCompose(['erp_report_check_view', reportGameCheckList.perm, reportGameCheckGet.perm, reportGameCheckGetDetail.perm]),
      edit: getPermsCompose(['erp_report_check_edit', reportGameCheckSet.perm, financeTableIncDec.perm]),
      inc_dec_log: getPermsCompose(['erp_report_close_inc_dec_log', reportCheckIncDecLog.perm])
    },
    // 收码
    close: {
      view: getPermsCompose(['erp_report_close_view', reportGameCloseList.perm, reportCloseDetail.perm])
    }
  },
  // 商品管理
  goods: {
    // 店铺管理
    store: {
      view: getPermsCompose(['erp_goods_store_view']),
      edit: getPermsCompose(['erp_goods_store_edit', storeSet.perm, storeStatus.perm]),
      del: getPermsCompose(['erp_goods_store_del', storeDel.perm])
    },
    // 库存管理
    stock: {
      view: getPermsCompose(['erp_goods_stock_view', stockLists.perm]),
      edit: getPermsCompose(['erp_goods_stock_edit', stockSet.perm, stockStatus.perm, stockExchangeStatus.perm, stockSetNumber.perm]),
      del: getPermsCompose(['erp_goods_stock_del', stockDel.perm])
    },
    // 订单管理
    order: {
      view: getPermsCompose(['erp_goods_order_view', stockOrderLists.perm]),
      status: getPermsCompose(['erp_goods_order_status', stockOrderStatus.perm]),
      log: getPermsCompose(['erp_goods_order_log', stockOrderLog.perm])
    },
    // 商品下单
    book: {
      view: getPermsCompose(['erp_goods_book_view', stockLists.perm, stockOrderLists.prem, stockOrderSet.perm])
    },
    // 商品类型
    type: {
      view: getPermsCompose(['erp_goods_type_view']),
      edit: getPermsCompose(['erp_goods_type_edit', stockTypeSet.prem]),
      del: getPermsCompose(['erp_goods_type_del', stockTypeDel.perm])
    }
  },
  // 组织管理
  org: {
    // 部门管理
    department: {
      view: getPermsCompose(['erp_org_department_view']),
      edit: getPermsCompose(['erp_org_department_edit', deptAdd.perm, deptEdit.perm]),
      del: getPermsCompose(['erp_org_department_del', deptDelete.perm])
    },
    // 岗位管理
    job: {
      view: getPermsCompose(['erp_org_job_view']),
      edit: getPermsCompose(['erp_org_job_edit', jobsAdd.perm, jobsEdit.perm]),
      del: getPermsCompose(['erp_org_job_del', jobsDelete.perm])
    }
  },
  // 员工管理
  staff: {
    // 员工资料
    admin: {
      view: getPermsCompose(['erp_staff_admin_view', adminLists.perm, adminDetail.perm]),
      edit: getPermsCompose(['erp_staff_admin_edit', adminAdd.perm, adminEdit.perm, adminSetPassword.perm]),
      del: getPermsCompose(['erp_staff_admin_del', adminDelete.perm])
    },
    // 楼栋管理
    building: {
      view: getPermsCompose(['erp_staff_building_view']),
      edit: getPermsCompose(['erp_staff_building_edit', staffBuildingSet.perm]),
      del: getPermsCompose(['erp_staff_building_del', staffBuildingDel.perm])
    },
    // 宿舍管理
    apartment: {
      view: getPermsCompose(['erp_staff_apartment_view', staffApartmentLists.perm]),
      edit: getPermsCompose([
        'erp_staff_apartment_edit',
        staffApartmentSet.perm,
        staffApartmentAdminLists.perm,
        staffApartmentAdminSet.perm,
        staffApartmentAdminDel.perm
      ]),
      del: getPermsCompose(['erp_staff_apartment_del', staffApartmentDel.perm])
    },
    // 房间入住
    check_in: {
      view: getPermsCompose([
        'erp_staff_check_in_view',
        staffApartmentLists.perm,
        staffApartmentAdminLists.perm,
        staffApartmentAdminSet.perm,
        staffApartmentAdminDel.perm
      ])
    },
    // 住户明细
    apartment_admin: {
      view: getPermsCompose(['erp_staff_apartment_admin_view', staffApartmentAdminLists.perm]),
      bind: getPermsCompose([
        'erp_staff_apartment_admin_edit',
        staffApartmentAdminLists.perm,
        staffApartmentAdminSet.perm,
        staffApartmentAdminDel.perm
      ])
    }
  },
  // 权限管理
  perms: {
    // 菜单管理
    menu: {
      view: getPermsCompose(['erp_perms_menu_view', menuLists.perm, menuDetail.perm]),
      edit: getPermsCompose(['erp_perms_menu_edit', menuAdd.perm, menuEdit.perm]),
      del: getPermsCompose(['erp_perms_menu_del', menuDelete.perm])
    },
    // 角色管理
    role: {
      view: getPermsCompose(['erp_perms_role_view', roleLists.perm, roleDetail.perm]),
      edit: getPermsCompose(['erp_perms_role_edit', roleAdd.perm, roleEdit.perm, roleDataPermsAssign.perm]),
      del: getPermsCompose(['erp_perms_role_del', roleDelete.perm])
    },
    // 数据权限组管理
    data: {
      view: getPermsCompose(['erp_perms_data_view']),
      edit: getPermsCompose(['erp_perms_data_edit', roleDataPermsSet.perm]),
      del: getPermsCompose(['erp_perms_data_del', roleDataPermsDel.perm])
    }
  },
  // 积分管理
  point: {
    // 会员积分
    summary: {
      view: getPermsCompose(['erp_point_summary_view', pointsSummaryLists.perm]),
      edit: getPermsCompose(['erp_point_summary_edit', pointsSummarySet.perm, pointsSummaryDeduct.perm, pointsSummarySetExpire.perm]),
      log: getPermsCompose(['erp_point_summary_log', pointsDetailLists.perm])
    },
    // 消费项目
    consume_name: {
      view: getPermsCompose(['erp_point_consume_name_view', pointsConsumeNameLists.perm]),
      edit: getPermsCompose(['erp_point_consume_name_edit', pointsConsumeNameSet.perm]),
      del: getPermsCompose(['erp_point_consume_name_del', pointsConsumeNameDel.perm])
    }
  },
  // 现场
  scene: {
    // 录入
    enter: {
      view: getPermsCompose([
        'erp_scene_enter_view',
        sceneEnterInfo.perm,
        sceneBettingSet.perm,
        sceneBettingOpening.perm,
        sceneBettingBalance.perm,
        betBootNumber.perm,
        betOpenBootNumber.perm,
        betDetailByBootNumber.perm,
        betNextBootNumber.perm,
        //
        reportGameCheckGet.perm,
        reportGameCheckSet.perm,
        reportGameCloseGet.perm,
        reportGameCloseSet.perm,
        //
        financeTableIncDec.perm,
        financeTableSetUserCabinet.perm,
        financeTransfer.perm,
        financeTipSet.perm,
        //
        stockOrderLists.prem,
        stockOrderSet.perm,
        //
        betModify.perm,
        betGwm.perm,
        betBonusModify.perm,
        betBonusGwm.perm
      ])
    }
  },
  // 系统管理
  system_setting: {
    // 网站信息
    website: {
      view: getPermsCompose(['erp_system_setting_website_view', getWebsite.perm, setWebsite.perm])
    },
    // 存储设置
    storage: {
      view: getPermsCompose(['erp_system_setting_storage_view', storageLists.perm, storageDetail.perm, storageSetup.perm, storageChange.perm])
    },
    // 系统日志
    log: {
      view: getPermsCompose(['erp_system_setting_log_view', systemLogLists.perm])
    },
    // 系统缓存
    cache: {
      view: getPermsCompose(['erp_system_setting_cache_view', systemCacheClear.perm, systemClearData.perm, systemChoiceClearData.perm])
    },
    // 系统环境
    env: {
      view: getPermsCompose(['erp_system_setting_env_view', systemInfo.perm])
    },
    // 国际化设置
    translate: {
      view: getPermsCompose(['erp_system_setting_translate_view'])
    }
  },
  // 会员管理
  user: {
    // 会员列表
    list: {
      view: getPermsCompose(['erp_user_list_view', userLists.perm, userDetail.perm]),
      edit: getPermsCompose(['erp_user_list_edit', userSet.perm, userSwitchButton.perm, userEditAttr.perm, userSetPassword.perm]),
      del: getPermsCompose(['erp_user_list_del', userDelete.perm]),
      log: getPermsCompose(['erp_user_list_log', userLastLog.perm])
    },
    // 会员等级
    level: {
      view: getPermsCompose(['erp_user_level_view']),
      edit: getPermsCompose(['erp_user_level_edit', userLevelAdd.perm, userLevelEdit.perm]),
      del: getPermsCompose(['erp_user_level_del', userLevelDel.perm])
    },
    // 会员类型
    type: {
      view: getPermsCompose(['erp_user_type_view']),
      edit: getPermsCompose(['erp_user_type_edit', userTypeAdd.perm, userTypeEdit.perm]),
      del: getPermsCompose(['erp_user_type_del', userTypeDel.perm])
    }
  },
  // 工作台
  workbench: {
    page: {
      view: getPermsCompose(['erp_workbench_page_view', getWorkbench.perm])
    }
  }
};
