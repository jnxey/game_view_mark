import { getRequestGet, getRequestPost } from '@/tools/request';

export const systemInfo = getRequestGet({ name: '获取系统环境', url: '/setting.system.system/info' });

export const systemLogLists = getRequestGet({ name: '获取系统日志列表', url: '/setting.system.log/lists' });

export const systemCacheClear = getRequestPost({ name: '清除系统缓存', url: '/setting.system.cache/clear' });

export const systemClearData = getRequestPost({ name: '清理数据', url: '/setting.system.system/clearData' });

export const systemChoiceClearData = getRequestPost({ name: '清理选择的数据', url: '/setting.system.system/choiceClearData' });
