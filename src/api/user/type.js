import { getRequestGet, getRequestPost } from '@/tools/request';

export const userTypeLists = getRequestGet({ name: '用户类型列表', url: '/user.user_type/lists' });

export const userTypeAdd = getRequestPost({ name: '新增用户类型', url: '/user.user_type/add' });

export const userTypeEdit = getRequestPost({ name: '修改用户类型', url: '/user.user_type/edit' });

export const userTypeDel = getRequestPost({ name: '删除用户类型', url: '/user.user_type/del' });
