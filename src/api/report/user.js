import { getRequestGet, getRequestPost } from '@/tools/request';

export const reportUserLists = getRequestGet({ name: '会员盈亏报表', url: '/order.betting/reportUserLists' });

export const reportUserIncomeSettler = getRequestPost({ name: '会员收益结算', url: '/order.betting/incomeSettler' });

export const reportUserIncomeSettlerLog = getRequestGet({ name: '会员收益结算明细', url: '/order.betting/userIncomeSettlementLog' });

export const reportUserDetail = getRequestGet({ name: '会员盈亏报表详情', url: '/order.betting/reportUserSplitLists' });

export const reportCheckHasChild = getRequestGet({ name: '会员盈亏报表详情', url: '/user.user/checkHasChild' });
