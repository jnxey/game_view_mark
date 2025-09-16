import { getRequestGet, getRequestPost } from '@/tools/request';

export const betOpenLists = getRequestGet({ name: '开牌结果列表', url: '/order.betting/openLists' });

export const betOpenSet = getRequestPost({ name: '编辑开牌结果', url: '/order.betting/setOpening', logRefresh: true });

export const betOpenDel = getRequestPost({ name: '删除开牌结果', url: '/order.betting/delOpening', logRefresh: true });

export const betOpenLog = getRequestGet({ name: '开牌结果操作记录', url: '/order.betting/openLogLists' });
