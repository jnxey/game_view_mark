import { getRequestGet, getRequestPost } from '@/tools/request';

export const userLevelLists = getRequestGet({ name: '用户等级列表', url: '/user.user_level/lists' });

export const userLevelAdd = getRequestPost({ name: '新增用户等级', url: '/user.user_level/add' });

export const userLevelEdit = getRequestPost({ name: '修改用户等级', url: '/user.user_level/edit' });

export const userLevelDel = getRequestPost({ name: '删除用户等级', url: '/user.user_level/del' });
