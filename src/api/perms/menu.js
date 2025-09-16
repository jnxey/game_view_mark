import { getRequestGet, getRequestPost } from '@/tools/request';

export const menuLists = getRequestGet({ name: '菜单列表', url: '/auth.menu/lists' });

export const menuAll = getRequestGet({ name: '全部菜单', url: '/auth.menu/all' });

export const menuAdd = getRequestPost({ name: '添加菜单', url: '/auth.menu/add' });

export const menuEdit = getRequestPost({ name: '编辑菜单', url: '/auth.menu/edit' });

export const menuDelete = getRequestPost({ name: '删除菜单', url: '/auth.menu/delete' });

export const menuDetail = getRequestGet({ name: '菜单详情', url: '/auth.menu/detail' });
