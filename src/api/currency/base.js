import { getRequestGet, getRequestPost } from '@/tools/request';
import { YES_NO_VALUE } from '@/values';

export const currencyBaseLists = getRequestGet({
  name: '基础货币配置列表',
  url: '/setting.currency.currency/lists',
  mixin: { virtual_status: YES_NO_VALUE.no }
});

export const currencyBaseSet = getRequestPost({ name: '设置基础货币配置', url: '/setting.currency.currency/set' });

export const currencyBaseDel = getRequestPost({ name: '删除基础货币配置', url: '/setting.currency.currency/del' });
