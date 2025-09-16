import { getRequestGet, getRequestPost } from '@/tools/request';

export const financeRemitTypeLists = getRequestGet({ name: '汇款方式列表', url: '/finance.remittance_type/lists' });

export const financeRemitTypeSet = getRequestPost({ name: '汇款方式新增编辑', url: '/finance.remittance_type/set' });

export const financeRemitTypeDel = getRequestPost({ name: '汇款方式删除', url: '/finance.remittance_type/del' });
