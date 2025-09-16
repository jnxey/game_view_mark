import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const stockLists = getRequestGet({
  name: '库存',
  url: '/external.Stock/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['price', 'price_amount', 'purchase_price', 'total_residual_price'])
});

export const stockSet = getRequestPost({ name: '编辑库存', url: '/external.Stock/set' });

export const stockDel = getRequestPost({ name: '删除库存', url: '/external.Stock/del' });

export const stockStatus = getRequestPost({ name: '库存状态', url: '/external.stock/setStatus' });

export const stockExchangeStatus = getRequestPost({ name: '库存兑换状态', url: '/external.stock/setExchangeStatus' });
