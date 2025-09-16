import { getRequestGet, getRequestPost } from '@/tools/request';

export const pointsSummaryLists = getRequestGet({ name: '积分总额表列表', url: '/points.summary/lists' });

export const pointsSummarySet = getRequestPost({ name: '积分充值', url: '/points.summary/set' });

export const pointsSummaryDeduct = getRequestPost({ name: '积分扣除', url: '/points.summary/deduct' });

export const pointsSummaryGetExpire = getRequestGet({ name: '获取积分过期时间', url: '/points.summary/getExpire' });

export const pointsSummarySetExpire = getRequestPost({ name: '设置积分过期时间', url: '/points.summary/setExpire' });
