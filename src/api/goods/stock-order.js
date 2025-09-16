import { getRequestGet, getRequestPost } from '@/tools/request';

export const stockOrderLists = getRequestGet({ name: '商品订单列表', url: '/external.StockOrder/lists' });

export const stockOrderSet = getRequestPost({ name: '编辑商品订单', url: '/external.StockOrder/set', logRefresh: true });

export const stockOrderDel = getRequestPost({ name: '删除商品订单', url: '/external.StockOrder/del', logRefresh: true });

export const stockOrderStatus = getRequestPost({ name: '商品订单状态', url: '/external.StockOrder/setStatus', logRefresh: true });

export const stockOrderLog = getRequestGet({ name: '商品订单日志', url: '/external.StockOrder/lastLog' });
