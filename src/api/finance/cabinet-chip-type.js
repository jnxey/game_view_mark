import { getRequestGet, getRequestPost } from '@/tools/request';
import { QUERY_LIST_SORT, YES_NO_VALUE } from '@/values';

export const financeCabinetChipTypeLists = getRequestGet({
  name: '柜子类型列表',
  url: '/finance.cabinet_chip_type/lists',
  mixin: { field: 'sort', order_by: QUERY_LIST_SORT.ascending }
});

export const financeCabinetChipTypeSet = getRequestPost({ name: '编辑柜子类型', url: '/finance.cabinet_chip_type/set' });

export const financeCabinetChipTypeDel = getRequestPost({ name: '删除柜子类型', url: '/finance.cabinet_chip_type/del' });

export const financeCabinetChipTypeSort = getRequestPost({ name: '柜子类型配置排序', url: '/finance.cabinet_chip_type/dragSort' });
