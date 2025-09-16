import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const gameChipLists = getRequestGet({
  name: '点码配置列表',
  url: '/setting.game.game_check/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['value'])
});

export const gameChipSet = getRequestPost({ name: '编辑点码配置', url: '/setting.game.game_check/set' });

export const gameChipDel = getRequestPost({ name: '删除点码配置', url: '/setting.game.game_check/del' });
