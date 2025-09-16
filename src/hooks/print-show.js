import { GAME_MODEL, GAME_MODEL_TYPE_BACCARAT } from '@/values';
import { getNiuniuResult } from '@/tools/road';
import dayjs from 'dayjs';
import { formatServerTime, getTimeFormat, isArray } from '@/tools';
import { $ti } from '@/lang/input';

// 开牌结果-打印显示
export function useBetOpenShow(getKindsMap, getBetResult = (r) => r.bet_result) {
  return (_, row) => {
    const kindsMap = getKindsMap();
    const betResult = getBetResult(row);
    if (!betResult) return '';
    if (GAME_MODEL_TYPE_BACCARAT.includes(row.game_model)) {
      return betResult?.map((kid) => $ti(kindsMap[kid]?.name)).join(',');
    } else if (row.game_model === GAME_MODEL.niu_niu) {
      return getNiuniuResult(betResult);
    }
  };
}

// 会员注单-打印显示
export function useBetUserShow(getCard) {
  return (_, row) => {
    const card = getCard(row);
    return [$ti(card.game_kind_name), card.amount, $ti(card.currency_config_name)].join(';');
  };
}

// 拼接-打印显示
export function useJointShow(k1, k2) {
  return (_, row) => {
    return [row[k1], row[k2]].join(';');
  };
}

// 时间范围-打印显示
export function useDateRangeShow(k1, k2) {
  return (_, row) => {
    return [dayjs(formatServerTime(row[k1])).format(getTimeFormat()), dayjs(formatServerTime(row[k2])).format(getTimeFormat())].join('到');
  };
}

// 酒店入住信息-打印显示
export function useHotelGuestShow() {
  return (cell, row) => {
    if (!isArray(cell)) return '';
    const infoList = cell.map((guest) => {
      return '<div>' + [guest?.guest_username || guest?.guest_nickname, guest?.guest_id_number, guest?.guest_telephone].join(',') + '</div>';
    });
    return infoList.join();
  };
}
