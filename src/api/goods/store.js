import { getRequestGet, getRequestPost } from '@/tools/request';

export const storeLists = getRequestGet({ name: '店铺', url: '/external.store/lists' });

export const storeSet = getRequestPost({ name: '编辑店铺', url: '/external.store/set' });

export const storeDel = getRequestPost({ name: '删除店铺', url: '/external.store/del' });

export const storeStatus = getRequestPost({ name: '店铺状态', url: '/external.store/setStatus' });
