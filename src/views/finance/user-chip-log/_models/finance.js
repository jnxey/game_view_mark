import { $t } from '@/lang/i18n';
import { BALANCE_TYPE } from '@/views/finance/user-chip/_model';
import { CURRENCY_TYPE } from '@/values';

export const FINANCE_ACTION_TRANSFER = 27;
export const FINANCE_ACTION_UP_DOWN_SCORE = [60, 61];
export const FINANCE_ACTION_REMIT = [70, 71];

// 动作，10-投注，11-投注赢，12-投注输，13-修改投注，14-投注补记，20-买码，21-换现，22-存码，23-取码，24-签单，25-还单，26-台面买码，27-转码, 30-洗码结算为现金，31-洗码结算为筹码，40-筹码清零，15-彩金投注（默认输的含义），16-修改彩金，17-彩金补记，18-彩金赢
export const FINANCE_ACTION = [
  { value: 10, name: $t('log.action_code_10') },
  { value: 11, name: $t('log.action_code_11') },
  // { value: 12, name: $t('log.action_code_12') },
  { value: 13, name: $t('log.action_code_13') },
  { value: 14, name: $t('log.action_code_14') },
  { value: 15, name: $t('log.action_code_15') },
  { value: 16, name: $t('log.action_code_16') },
  { value: 17, name: $t('log.action_code_17') },
  { value: 18, name: $t('log.action_code_18') },
  { value: 20, name: $t('log.action_code_20'), color: '#00BFA5', filter: BALANCE_TYPE.cabinet_buy.user_unique },
  { value: 21, name: $t('log.action_code_21'), color: '#00BFA5', filter: BALANCE_TYPE.cabinet_buy.user_unique },
  {
    value: 22,
    name: $t('log.action_code_22'),
    color: '#42A5F5',
    filter: BALANCE_TYPE.deposit_amount.user_unique,
    getName: (currencyType) => {
      return currencyType === CURRENCY_TYPE.cash ? $t('finance.user_chip.btn_save_cash') : $t('finance.user_chip.btn_save_code');
    }
  },
  {
    value: 23,
    name: $t('log.action_code_23'),
    color: '#42A5F5',
    filter: BALANCE_TYPE.deposit_amount.user_unique,
    getName: (currencyType) => {
      return currencyType === CURRENCY_TYPE.cash ? $t('finance.user_chip.btn_take_cash') : $t('finance.user_chip.btn_take_code');
    }
  },
  { value: 24, name: $t('log.action_code_24'), color: '#AB47BC', filter: BALANCE_TYPE.sign_amount.user_unique },
  { value: 25, name: $t('log.action_code_25'), color: '#AB47BC', filter: BALANCE_TYPE.sign_amount.user_unique },
  { value: 26, name: $t('log.action_code_26') },
  { value: 27, name: $t('log.action_code_27'), color: '#00BFA5', filter: BALANCE_TYPE.chip_transfer.user_unique },
  { value: 41, name: $t('log.action_code_41'), color: '#00BFA5', filter: BALANCE_TYPE.chip_transfer.user_unique },
  { value: 28, name: $t('log.action_code_28') },
  { value: 30, name: $t('log.action_code_30'), no_count: true },
  { value: 31, name: $t('log.action_code_31') },
  { value: 40, name: $t('log.action_code_40') },
  { value: 60, name: $t('log.action_code_60'), color: '#66BB6A', filter: BALANCE_TYPE.point_amount.user_unique },
  { value: 61, name: $t('log.action_code_61'), color: '#66BB6A', filter: BALANCE_TYPE.point_amount.user_unique },
  { value: 70, name: $t('log.action_code_70'), color: '#e59217', filter: BALANCE_TYPE.cabinet_remit.user_unique },
  { value: 71, name: $t('log.action_code_71'), color: '#e59217', filter: BALANCE_TYPE.cabinet_remit.user_unique },
  { value: 80, name: $t('log.action_code_80'), no_count: true },
  { value: 50, name: $t('other.title') }
];

// 需要filter的类型
export const FINANCE_ACTION_NEED_FILTER = [
  BALANCE_TYPE.cabinet_buy.user_unique,
  BALANCE_TYPE.deposit_amount.user_unique,
  BALANCE_TYPE.sign_amount.user_unique,
  BALANCE_TYPE.point_amount.user_unique,
  BALANCE_TYPE.cabinet_remit.user_unique,
  BALANCE_TYPE.chip_transfer.user_unique
];
