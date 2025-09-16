import { storage } from '@/tools/storage';
import { CACHE_SELECT_ITEM } from '@/values/cache';
import { isEmpty, isFunction, isString, mappingArrayToObject } from '@/tools';

export const SELECT_CACHE_KEYS = {
  table_buy: 'table_buy',
  table_chip_eidt: 'table_chip_eidt',
  user_chip_list: 'user_chip_list',
  user_chip_filter: 'user_chip_filter',
  user_chip_transfer: 'user_chip_transfer',
  user_chip_remit: 'user_chip_remit',
  user_chip_cabinet_show: 'user_chip_cabinet_show',
  user_chip_print: 'user_chip_print',
  user_chip_print_all: 'user_chip_print_all',
  user_chip_balance_pattern: 'user_chip_balance_pattern',
  code_washing: 'code_washing',
  tip_add: 'tip_add',
  game_kind_model: 'game_kind_model',
  game_chip_currency: 'game_chip_currency',
  desk_main: 'desk_main',
  scene_enter_fold: 'scene_enter_fold'
};

// 缓存选择
export function useSelectCache(key, getFromList, field = 'id') {
  const getItem = (hasDef = true) => {
    const cache = storage.get(CACHE_SELECT_ITEM) ?? {};
    const cacheValue = cache[key];
    if (isFunction(getFromList)) {
      const fromList = getFromList() ?? [];
      const formMap = mappingArrayToObject(fromList, field);
      if (isString(cacheValue) && !isEmpty(cacheValue)) {
        const arr = cacheValue.split(',');
        const result = arr.filter((val) => !!formMap[String(val)]).join(',');
        return !!result ? result : hasDef ? fromList[0]?.[field] : null;
      } else {
        return !!formMap[cacheValue] ? cacheValue : hasDef ? fromList[0]?.[field] : null;
      }
    } else {
      return cacheValue;
    }
  };

  const setItem = (value) => {
    const cache = storage.get(CACHE_SELECT_ITEM) ?? {};
    cache[key] = value;
    storage.set(CACHE_SELECT_ITEM, cache);
  };

  return { getItem, setItem };
}
