import { getRequestGet, getRequestPost } from '@/tools/request.js';

// 部门列表
export const deptLists = getRequestGet({ name: '部门列表', url: '/dept.dept/lists' });

// 添加部门
export const deptAdd = getRequestPost({ name: '添加部门', url: '/dept.dept/add' });

// 编辑部门
export const deptEdit = getRequestPost({ name: '编辑部门', url: '/dept.dept/edit' });

// 删除部门
export const deptDelete = getRequestPost({ name: '删除部门', url: '/dept.dept/delete' });

// 部门详情
export const deptDetail = getRequestGet({ name: '部门详情', url: '/dept.dept/detail' });

// 部门列表全部
export const deptAll = getRequestGet({ name: '部门列表全部', url: '/dept.dept/all' });
