import { getRequestGet, getRequestPost } from '@/tools/request';

export const reportTableLists = getRequestGet({ name: '台面盈亏报表', url: '/order.betting/reportTableLists' });

export const reportTableDetail = getRequestGet({ name: '台面盈亏报表详情', url: '/order.betting/reportTableSplitLists' });
