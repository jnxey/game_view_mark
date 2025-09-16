import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeTipLists = getRequestGet({ name: '小费数据列表', url: '/finance.tip/lists' });

export const financeTipSet = getRequestPost({ name: '编辑小费', url: '/finance.tip/set', logRefresh: true });

export const financeTipDel = getRequestPost({ name: '删除小费', url: '/finance.tip/del', logRefresh: true });

export const financeTipLog = getRequestGet({ name: '小费操作记录', url: '/finance.tip/lastLog' });
