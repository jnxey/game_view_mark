import { getRequestGet, getRequestPost } from '@/tools/request.js';

// 岗位列表
export const jobsLists = getRequestGet({ name: '岗位列表', url: '/dept.jobs/lists' });

// 岗位列表全部
export const jobsAll = getRequestGet({ name: '岗位列表全部', url: '/dept.jobs/all' });

// 添加岗位
export const jobsAdd = getRequestPost({ name: '岗位列表全部', url: '/dept.jobs/add' });

// 编辑岗位
export const jobsEdit = getRequestPost({ name: '编辑岗位', url: '/dept.jobs/edit' });

// 删除岗位
export const jobsDelete = getRequestPost({ name: '删除岗位', url: '/dept.jobs/delete' });

// 岗位详情
export const jobsDetail = getRequestGet({ name: '岗位详情', url: '/dept.jobs/detail' });
