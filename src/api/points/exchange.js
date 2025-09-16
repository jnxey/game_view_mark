import { getRequestGet, getRequestPost } from '@/tools/request';

export const pointsExchangeSet = getRequestGet({ name: '消费', url: '/points.exchange/set' });

export const pointsExchangeSetAuto = getRequestPost({ name: '设置自动兑换', url: '/points.exchange/setAuto' });

export const pointsExchangeGetParams = getRequestGet({ name: '获取配置', url: '/points.exchange/getParams' });
