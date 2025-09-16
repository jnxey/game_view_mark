/**
 * 表格数据自定义排序通用方法
 */
import { reactive } from 'vue';
import { checkIndexArray } from '@/tools';
import { ELEMENT_SORT, QUERY_LIST_SORT } from '@/values';

export function useFieldSort(defaultSort) {
  // 缓存排序信息
  const orderSortInfo = reactive(defaultSort ?? []);

  // 变更排序
  const handleChangeSort = (prop, refresh) => {
    // [ELEMENT_SORT.ascending,ELEMENT_SORT.descending, null];
    const key = orderSortInfo.findIndex((val) => val.prop === prop);
    if (checkIndexArray(key)) {
      const order = orderSortInfo[key].order;
      let next = null;
      if (order === ELEMENT_SORT.ascending) next = ELEMENT_SORT.descending;
      if (order === ELEMENT_SORT.descending) next = null;
      if (!order) next = ELEMENT_SORT.ascending;
      orderSortInfo[key] = { ...orderSortInfo[key], order: next };
    } else {
      orderSortInfo.push({ prop, order: ELEMENT_SORT.ascending });
    }
    return refresh();
  };

  // 设置表头样式
  const handleSortClass = (prop, info) => {
    const key = info.findIndex((val) => val.prop === prop);
    if (checkIndexArray(key)) {
      return info[key].order;
    }
  };

  // 通过Sort配置获取请求所需参数
  const getSortParams = () => {
    const props = orderSortInfo.map((item) => item.prop);
    const orders = orderSortInfo.map((item) => QUERY_LIST_SORT[item.order]);
    if (!!props.length && !!orders.length) {
      return { field: props.join(','), order_by: orders.join(',') };
    } else {
      return {};
    }
  };

  return { orderSortInfo, handleChangeSort, handleSortClass, getSortParams };
}
