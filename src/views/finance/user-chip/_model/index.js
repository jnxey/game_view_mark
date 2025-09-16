import { $t } from '@/lang/i18n';
import { CURRENCY_TYPE } from '@/values';

// 余额操作类型
export const BALANCE_TYPE = {
  code_washing: {
    amount_types: { dec: $t('finance.user_chip.btn_settle_cash'), inc: $t('finance.user_chip.btn_settle_chip') },
    cabinet_chip_type_id: 1,
    user_unique: 'code_washing'
  },
  deposit_amount: {
    amount_types: { inc: $t('finance.user_chip.btn_save'), dec: $t('finance.user_chip.btn_take') },
    cabinet_chip_type_id: 2,
    user_unique: 'deposit_amount',
    getTitle: (amountType, currencyType) => {
      if (currencyType === CURRENCY_TYPE.cash) {
        const map = { inc: $t('finance.user_chip.btn_save_cash'), dec: $t('finance.user_chip.btn_take_cash') };
        return map[amountType];
      } else {
        const map = { inc: $t('finance.user_chip.btn_save_code'), dec: $t('finance.user_chip.btn_take_code') };
        return map[amountType];
      }
    }
  },
  sign_amount: {
    amount_types: { inc: $t('finance.user_chip.btn_sign'), dec: $t('finance.user_chip.btn_return') },
    cabinet_chip_type_id: 3,
    user_unique: 'sign_amount'
  },
  cabinet_buy: {
    amount_types: { inc: $t('finance.user_chip.btn_buy'), dec: $t('finance.user_chip.btn_cash') },
    cabinet_chip_type_id: 4,
    user_unique: 'cabinet_buy'
  },
  point_amount: {
    amount_types: { inc: $t('finance.user_chip.btn_score_up'), dec: $t('finance.user_chip.btn_score_down') },
    cabinet_chip_type_id: 5,
    user_unique: 'point_amount'
  },
  cabinet_remit: {
    amount_types: { inc: $t('finance.user_chip.btn_remit_in'), dec: $t('finance.user_chip.btn_remit_out') },
    cabinet_chip_type_id: 7,
    user_unique: 'cabinet_remit'
  },
  chip_balance: {
    user_unique: 'chip_balance'
  },
  chip_transfer: {
    user_unique: 'chip_transfer'
  },
  chip_transfer_type: {
    desk: 'desk_exchange_chip',
    manager: 'exchange_chip'
  }
};

// 柜子明细类型
export const CABINET_CHIP_FIELD = 'cabinet_chip';
