import { getRequestGet, getRequestPost } from '@/tools/request';

export const roleLists = getRequestGet({ name: '角色列表', url: '/auth.role/lists' });

export const roleAll = getRequestGet({ name: '角色列表全部', url: '/auth.role/all' });

export const roleAdd = getRequestPost({ name: '添加角色', url: '/auth.role/add' });

export const roleEdit = getRequestPost({ name: '编辑角色', url: '/auth.role/edit' });

export const roleDelete = getRequestPost({ name: '删除角色', url: '/auth.role/delete' });

export const roleDetail = getRequestGet({ name: '角色详情', url: '/auth.role/detail' });

export const roleDataPerms = getRequestGet({ name: '数据权限组列表', url: '/auth.dataPermission/lists' });

export const roleRoleDataPerms = getRequestGet({ name: '角色数据权限组', url: '/auth.dataPermission/getRoleDataPermission' });

export const roleDataPermsSet = getRequestPost({ name: '数据权限组设置', url: '/auth.dataPermission/set' });

export const roleDataPermsDel = getRequestPost({ name: '数据权限组删除', url: '/auth.dataPermission/delete' });

export const roleDataPermsAssign = getRequestPost({ name: '数据权限组删除', url: '/auth.dataPermission/assign' });
