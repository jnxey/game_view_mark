import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeCabinetChipLists = getRequestGet({ name: '柜子列表', url: '/finance.cabinet_chip/lists' });

export const financeCabinetChipSetAmount = getRequestPost({ name: '编辑柜子余额', url: '/finance.cabinet_chip/setAmount' });

export const financeCabinetChipDel = getRequestPost({ name: '删除柜子', url: '/finance.cabinet_chip/del' });
