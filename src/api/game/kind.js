import { getRequestGet, getRequestPost } from '@/tools/request';
import { QUERY_LIST_SORT } from '@/values';

export const gameKindLists = getRequestGet({
  name: '投注项列表',
  url: '/setting.game.game_kind/lists',
  mixin: { field: 'sort', order_by: QUERY_LIST_SORT.ascending }
});

export const gameKindSet = getRequestPost({ name: '设置投注项', url: '/setting.game.game_kind/set', logRefresh: true });

export const gameKindDel = getRequestPost({ name: '删除投注项;', url: '/setting.game.game_kind/del', logRefresh: true });

export const gameKindComposeGet = getRequestGet({ name: '获取组合配置;', url: '/setting.game.game_kinds/lists' });

export const gameKindComposeSet = getRequestPost({ name: '设置组合配置;', url: '/setting.game.game_kinds/set', logRefresh: true });

export const gameKindComposeDel = getRequestPost({ name: '删除组合配置;', url: '/setting.game.game_kinds/del', logRefresh: true });

export const gameKindSort = getRequestPost({ name: '设置投注项排序', url: '/setting.game.game_kind/dragSort', logRefresh: true });

export const gameKindLastLog = getRequestGet({ name: '投注项列表操作记录', url: '/setting.game.game_kind/lastLog' });
