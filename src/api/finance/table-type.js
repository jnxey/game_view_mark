import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeTableTypeLists = getRequestGet({ name: '台号类型列表', url: '/finance.table_type/lists' });

export const financeTableTypeSet = getRequestPost({ name: '编辑台号类型', url: '/finance.table_type/set' });

export const financeTableTypeDel = getRequestPost({ name: '删除台号类型', url: '/finance.table_type/del' });
