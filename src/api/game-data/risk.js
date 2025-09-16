import { getRequestGet } from '@/tools/request';

export const riskTableLists = getRequestGet({ name: '风险控制台盈亏', url: '/order.betting/riskTableLists' });

export const riskBetLists = getRequestGet({ name: '风险控制注单明细', url: '/order.betting/riskBetLists' });

export const riskCurrencyConfigLists = getRequestGet({ name: '风险控制按币种统计盈亏', url: '/order.betting/riskCurrencyConfigLists' });

export const riskCurrencyConfigTableLists = getRequestGet({
  name: '风险控制按币种会员台号统计盈亏',
  url: '/order.betting/riskCurrencyConfigTableLists'
});
