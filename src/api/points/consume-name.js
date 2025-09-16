import { getRequestGet, getRequestPost } from '@/tools/request';

export const pointsConsumeNameLists = getRequestGet({ name: '消费名称列表', url: '/points.consume_name/lists' });

export const pointsConsumeNameSet = getRequestPost({ name: '编辑消费名称', url: '/points.consume_name/set' });

export const pointsConsumeNameDel = getRequestPost({ name: '删除消费名称', url: '/points.consume_name/del' });
