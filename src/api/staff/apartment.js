import { getRequestGet, getRequestPost } from '@/tools/request';

export const staffApartmentLists = getRequestGet({ name: '宿舍列表', url: '/hostel.apartment/lists' });

export const staffApartmentSet = getRequestPost({ name: '设置宿舍', url: '/hostel.apartment/set' });

export const staffApartmentDel = getRequestPost({ name: '删除宿舍', url: '/hostel.apartment/del' });
