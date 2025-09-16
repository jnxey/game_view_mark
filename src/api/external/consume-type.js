import { getRequestGet, getRequestPost } from '@/tools/request';

export const externalConsumeTypeLists = getRequestGet({ name: '消费类型列表', url: '/external.ExternalConsumeType/lists' });

export const externalConsumeTypeSet = getRequestPost({ name: '编辑消费类型', url: '/external.ExternalConsumeType/set', logRefresh: true });

export const externalConsumeTypeDel = getRequestPost({ name: '删除消费类型', url: '/external.ExternalConsumeType/del', logRefresh: true });

export const externalConsumeTypeLog = getRequestGet({ name: '消费类型操作记录', url: '/external.ExternalConsumeType/lastLog' });
