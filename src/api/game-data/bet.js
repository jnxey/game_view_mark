import { getRequestGet, getRequestPost } from '@/tools/request';

export const betLists = getRequestGet({ name: '投注记录列表', url: '/order.betting/betUserLists' });

export const betModify = getRequestPost({ name: '修改投注记录', url: '/order.betting/modify', logRefresh: true });

export const betBonusModify = getRequestPost({ name: '修改投注彩金', url: '/order.betting/modifyBonus', logRefresh: true });

export const betGetBetWithOpenId = getRequestGet({ name: '通过OpenId获取投注记录', url: '/order.betting/getBetWithOpenId' });

export const betGwm = getRequestPost({ name: '会员投注记录补记', url: '/order.betting/gwm', logRefresh: true });

export const betBonusGwm = getRequestPost({ name: '会员投注彩金补记', url: '/order.betting/gwmBonus', logRefresh: true });

export const betActionLog = getRequestGet({ name: '会员注单操作明细', url: '/order.betting/betActionLogLists' });

export const betBonusList = getRequestGet({ name: '彩金投注列表', url: '/order.betting/bonusList' });

export const betRoundNumber = getRequestGet({ name: '获取某靴的局号列表', url: '/order.betting/getRoundNumberByBootNumber' });

export const betGwmRoundNumber = getRequestPost({ name: '补记局号', url: '/order.betting/gwmRoundNumber' });

export const betOpenDetail = getRequestGet({ name: '根据OpenId获取局信息', url: '/order.betting/betOpenDetail' });
