import { getRequestGet, getRequestPost } from '@/tools/request';

export const staffApartmentAdminLists = getRequestGet({ name: '住户明细列表', url: '/hostel.apartment_staff/lists' });

export const staffApartmentAdminSet = getRequestPost({ name: '设置住户明细', url: '/hostel.apartment_staff/set' });

export const staffApartmentAdminDel = getRequestPost({ name: '删除住户明细', url: '/hostel.apartment_staff/del' });

export const staffApartmentAdminGetStaff = getRequestGet({ name: '通过工号查找宿舍', url: '/hostel.apartment_staff/getStaff' });
