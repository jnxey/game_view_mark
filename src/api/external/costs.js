import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const externalCostsLists = getRequestGet({
  name: '支出费用列表',
  url: '/external.ExternalCosts/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['money', 'rake'])
});

export const externalCostsSet = getRequestPost({ name: '编辑支出费用', url: '/external.ExternalCosts/set', logRefresh: true });

export const externalCostsDel = getRequestPost({ name: '删除支出费用', url: '/external.ExternalCosts/del', logRefresh: true });

export const externalCostsLog = getRequestGet({ name: '支出费用操作记录', url: '/external.ExternalCosts/lastLog' });
