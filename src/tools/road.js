import { parseDict } from '@/tools/index';
import { ROAD_NIUNIU_CARD_DICT, ROAD_NIUNIU_SEAT_DICT } from '@/values/road';
import { isObject } from '@vue/shared';

const roadNiuniuSeatMap = parseDict(ROAD_NIUNIU_SEAT_DICT);
const roadNiuniuCardMap = parseDict(ROAD_NIUNIU_CARD_DICT);

// 获取牛牛结果显示
export const getNiuniuResult = (result, toString = true) => {
  if (isObject(result)) {
    const info = [];
    Object.keys(result).forEach((p) => {
      const name = roadNiuniuSeatMap[p]?.name;
      const value = roadNiuniuCardMap[result[p]]?.name;
      info.push(name + ': ' + value);
    });
    return toString ? info.join(', ') : info;
  } else {
    return '';
  }
};
