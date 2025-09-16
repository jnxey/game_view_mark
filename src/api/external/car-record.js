import { getRequestGet, getRequestPost } from '@/tools/request';

export const carRecordLists = getRequestGet({ name: '用车记录列表', url: '/external.CarRecord/lists' });

export const carRecordSet = getRequestPost({ name: '编辑用车记录', url: '/external.CarRecord/set', logRefresh: true });

export const carRecordDel = getRequestPost({ name: '删除用车记录', url: '/external.CarRecord/del', logRefresh: true });

export const carRecordLog = getRequestGet({ name: '用车记录操作记录', url: '/external.CarRecord/lastLog' });
