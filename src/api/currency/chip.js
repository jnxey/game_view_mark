import { getRequestGet, getRequestPost } from '@/tools/request';

export const currencyChipLists = getRequestGet({ name: 'C码详情列表', url: '/setting.currency.chip_details/lists' });

export const currencyChipSet = getRequestPost({ name: '编辑C码详情', url: '/setting.currency.chip_details/set' });

export const currencyChipDel = getRequestPost({ name: '删除C码详情', url: '/setting.currency.chip_details/del' });
