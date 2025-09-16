import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeCurrencyExchangeLists = getRequestGet({ name: '兑换表列表', url: '/finance.currencyExchange/lists' });

export const financeCurrencyExchangeSet = getRequestPost({ name: '货币兑换', url: '/finance.currencyExchange/set' });
