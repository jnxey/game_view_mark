import { getRequestGet, getRequestPost } from '@/tools/request';

export const staffBuildingLists = getRequestGet({ name: '楼栋列表', url: '/hostel.building/lists' });

export const staffBuildingSet = getRequestPost({ name: '设置楼栋', url: '/hostel.building/set' });

export const staffBuildingDel = getRequestPost({ name: '删除楼栋', url: '/hostel.building/del' });
