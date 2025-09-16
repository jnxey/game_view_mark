import { getRequestGet, getRequestPost } from '@/tools/request';

export const adminLists = getRequestGet({ name: '管理员列表', url: '/auth.admin/lists' });

export const adminBaseLists = getRequestGet({ name: '管理员列表', url: '/auth.admin/baseLists' });

export const adminAll = getRequestGet({ name: '管理员列表全部', url: '/auth.admin/all' });

export const adminAdd = getRequestPost({ name: '管理员添加', url: '/auth.admin/add' });

export const adminEdit = getRequestPost({ name: '管理员编辑', url: '/auth.admin/edit' });

export const adminDelete = getRequestPost({ name: '管理员删除', url: '/auth.admin/delete' });

export const adminDetail = getRequestGet({ name: '管理员详情', url: '/auth.admin/detail' });

export const adminSetPassword = getRequestPost({ name: '管理员修改密码', url: '/auth.admin/setPassword' });
