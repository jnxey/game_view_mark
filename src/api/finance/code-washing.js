import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeCodeWashingList = getRequestGet({ name: '洗码费结算列表', url: '/order.betting/codeWashingSettlerList' });

export const financeCodeWashingSettler = getRequestPost({ name: '洗码费结算', url: '/order.betting/codeWashingSettler', logRefresh: true });

export const financeBetCommissionDetail = getRequestGet({ name: '投注分账详情', url: '/order.betting/betCommissionDetail', logRefresh: true });

export const financeCodeWashingSettlerLog = getRequestGet({ name: '洗码费结算日志', url: '/order.betting/codeWashingSettlerLog' });

export const financeBetCodeWashingLogs = getRequestGet({ name: '洗码变动明细', url: '/order.betting/betCodeWashingLogs', logRefresh: true });
