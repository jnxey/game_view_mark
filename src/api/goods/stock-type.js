import { getRequestGet, getRequestPost } from '@/tools/request';

export const stockTypeLists = getRequestGet({ name: '列表', url: '/external.StockType/lists' });

export const stockTypeSet = getRequestPost({ name: '编辑', url: '/external.StockType/set' });

export const stockTypeDel = getRequestPost({ name: '删除', url: '/external.StockType/del' });

export const stockSetNumber = getRequestPost({ name: '进出库', url: '/external.stock/setNumber' });
