import { getRequestGet, getRequestPost } from '@/tools/request';

export const reportGameCheckList = getRequestGet({ name: '点码明细列表', url: '/report.report_game_check/lists' });

export const reportGameCheckGet = getRequestGet({ name: '获取点码基础信息', url: '/report.report_game_check/get' });

export const reportGameCheckGetDetail = getRequestGet({ name: '点码明细列表', url: '/report.report_game_check/reportGameCheckGet' });

export const reportGameCheckSet = getRequestPost({ name: '点码设置', url: '/report.report_game_check/set' });

export const reportCheckIncDecLog = getRequestGet({ name: '增减码明细列表', url: '/finance.table_inc_dec/lists' });

export const reportGameCloseList = getRequestGet({ name: '收码明细列表', url: '/report.report_game_close/lists' });

export const reportGameCloseGet = getRequestGet({ name: '获取收码基础信息', url: '/report.report_game_close/get' });

export const reportGameCloseSet = getRequestPost({ name: '收码设置', url: '/report.report_game_close/set' });

export const reportGetCloseBind = getRequestGet({ name: '收码增减码算入获取', url: '/report.report_game_close/getCloseBind' });

export const reportSetCloseBind = getRequestPost({ name: '收码增减码算入设置', url: '/report.report_game_close/setCloseBind' });

export const reportCloseDetail = getRequestGet({ name: '根据收码ID查看相关点码数据', url: '/report.report_game_check/check_lists' });
