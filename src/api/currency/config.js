import { getRequestGet, getRequestPost } from '@/tools/request';
import { QUERY_LIST_SORT, YES_NO_VALUE } from '@/values';

export const currencyConfigLists = getRequestGet({
  name: '货币配置列表',
  url: '/setting.currency.currency_config/lists',
  mixin: { field: 'sort', order_by: QUERY_LIST_SORT.ascending, virtual_status: YES_NO_VALUE.no }
});

export const currencyConfigSet = getRequestPost({ name: '设置货币配置', url: '/setting.currency.currency_config/set' });

export const currencyConfigDel = getRequestPost({ name: '删除货币配置', url: '/setting.currency.currency_config/del' });

export const currencyConfigStatus = getRequestPost({ name: '变更货币配置状态', url: '/setting.currency.currency_config/setStatus' });

export const currencyConfigSort = getRequestPost({ name: '设置货币配置排序', url: '/setting.currency.currency_config/dragSort' });
