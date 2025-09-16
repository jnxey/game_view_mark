import { getRequestGet, getRequestPost } from '@/tools/request';

export const reportDayLists = getRequestGet({ name: '每日盈亏报表', url: '/order.betting/reportDayLists' });

export const reportDayDetail = getRequestGet({ name: '每日盈亏报表详情', url: '/order.betting/reportDaySplitLists' });
