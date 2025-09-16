import { getRequestGet, getRequestPost } from '@/tools/request';

export const carAdministerLists = getRequestGet({ name: '车辆管理列表', url: '/external.CarAdminister/lists' });

export const carAdministerSet = getRequestPost({ name: '编辑车辆管理', url: '/external.CarAdminister/set', logRefresh: true });

export const carAdministerDel = getRequestPost({ name: '删除车辆管理', url: '/external.CarAdminister/del', logRefresh: true });

export const carAdministerStart = getRequestPost({ name: '派车', url: '/external.CarAdminister/car_start', logRefresh: true });

export const carAdministerEnd = getRequestPost({ name: '回库', url: '/external.CarAdminister/car_end', logRefresh: true });

export const carAdministerLog = getRequestGet({ name: '车辆管理操作记录', url: '/external.CarAdminister/lastLog' });
