import { getRequestGet, getRequestPost } from '@/tools/request';

export const reportMonthLists = getRequestGet({ name: '每月盈亏报表', url: '/order.betting/reportMonthLists' });

export const reportMonthDetail = getRequestGet({ name: '每月盈亏报表详情', url: '/order.betting/reportMonthSplitLists' });
