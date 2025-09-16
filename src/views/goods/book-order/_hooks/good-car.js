import { computed, reactive, shallowRef, toRaw } from 'vue';
import { stockLists } from '@/api/goods/stock';
import { QUERY_LIST_TYPE } from '@/values';
import { calcAmount, checkIndexArray, mappingArrayToObject } from '@/tools';
import { storage } from '@/tools/storage';
import { CACHE_GOODS_CAR_SELECTED } from '@/values/cache';
import { stockOrderLists } from '@/api/goods/stock-order';

export function useGoodCar() {
  const cacheData = storage.get(CACHE_GOODS_CAR_SELECTED) ?? [];
  const stockData = reactive([]);
  const selected = reactive(cacheData);

  const recordData = shallowRef([]);

  const stockMap = computed(() => mappingArrayToObject(stockData));
  const selectedMap = computed(() => mappingArrayToObject(selected));

  const countAll = computed(() => {
    const result = {};
    const count = [];
    selected.forEach((item) => {
      const good = stockMap.value[item.stock_id];
      if (!good) return;
      if (!result[good.unit]) result[good.unit] = 0;
      result[good.unit] = result[good.unit] + calcAmount((good.price ?? 0) * item.number);
    });
    Object.keys(result).forEach((unit) => {
      count.push(String(unit + result[unit]));
    });
    return count.join(', ');
  });

  // 刷新商品数据
  const refresh = async () => {
    const { lists } = await stockLists({ page_type: QUERY_LIST_TYPE.all });
    stockData.splice(0);
    stockData.push(...lists);
  };

  // 刷新下单记录
  const refreshRecordData = async (query) => {
    const { lists } = await stockOrderLists({ page_no: 1, page_size: 50, ...query });
    recordData.value = lists;
  };

  // 添加商品
  const addGood = (good) => {
    const key = selected.findIndex((val) => val.stock_id === good.id);
    if (checkIndexArray(key)) {
      selected[key].number = selected[key].number + 1;
    } else {
      selected.push({ number: 1, stock_id: good.id });
    }
    storage.set(CACHE_GOODS_CAR_SELECTED, toRaw(selected));
  };

  // 设置商品数量
  const setNumber = (index, number) => {
    if (number === 0) {
      selected.splice(index, 1);
    } else {
      selected[index].number = number;
    }
    storage.set(CACHE_GOODS_CAR_SELECTED, toRaw(selected));
  };

  // 清空商品
  const clearGood = () => {
    selected.splice(0);
    storage.remove(CACHE_GOODS_CAR_SELECTED);
  };

  return { stockData, stockMap, selected, selectedMap, countAll, recordData, refresh, refreshRecordData, addGood, clearGood, setNumber };
}
