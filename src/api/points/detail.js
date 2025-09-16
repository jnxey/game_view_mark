import { getRequestGet } from '@/tools/request';

export const pointsDetailLists = getRequestGet({ name: '积分明细列表', url: '/points.summary/listsDetail' });
