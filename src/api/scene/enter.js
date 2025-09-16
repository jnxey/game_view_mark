import { getRequestGet, getRequestPost } from '@/tools/request';

export const sceneEnterInfo = getRequestGet({ name: '台面录入信息', url: '/scene.enter/get' });

export const sceneBettingSet = getRequestPost({ name: '台面录入', url: '/order.betting/set', errorAlert: true });

export const sceneBettingOpening = getRequestPost({ name: '台面获取鞋号', url: '/order.betting/opening', errorAlert: true });

export const sceneBettingBalance = getRequestPost({ name: '台面获取会员余额', url: '/order.betting/userInfo', noShowMsg: true });

export const betBootNumber = getRequestGet({ name: '获取未收码的靴号', url: '/order.betting/getBootNumber' });

export const betOpenBootNumber = getRequestGet({ name: '获取某靴的开牌结果列表', url: '/order.betting/getOpenBootNumber' });

export const betBootProfit = getRequestGet({ name: '获取某靴的输赢', url: '/order.betting/getCurrencyConfigProfit' });

export const betDetailByBootNumber = getRequestGet({ name: '获取某靴的投注详情列表', url: '/order.betting/getDetailByBootNumber' });

export const betNextBootNumber = getRequestGet({ name: '获取下一靴', url: '/order.betting/nextBootNumber' });
