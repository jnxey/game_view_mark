import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeUserChipLists = getRequestGet({ name: '码房管理表列表', url: '/user.user/listsCabinet' });

export const financeUserChipSet = getRequestPost({ name: '码房管理余额操作', url: '/finance.cabinet_chip/setUserCabinet', logRefresh: true });

export const financeUserChipClear = getRequestPost({ name: '会员筹码清零', url: '/finance.cabinet_chip/setChipClear', logRefresh: true });

export const financeUserLog = getRequestGet({ name: '码房管理日志', url: '/finance.cabinet_chip/lastLog' });

export const financeTransfer = getRequestPost({ name: '码房管理转码', url: '/finance.cabinet_chip/exchange', logRefresh: true });

export const financeAmountInfo = getRequestGet({ name: '获取会员金额信息', url: '/finance.cabinet_chip/getBalance' });

export const financeActionsSummary = getRequestGet({ name: '筹码变动动作计数汇总列表', url: '/finance.cabinet_chip/actionsSummary' });

export const financeRemittanceList = getRequestGet({ name: '汇入汇出明细汇款总计', url: '/finance.cabinet_chip/getRemittanceList' });
