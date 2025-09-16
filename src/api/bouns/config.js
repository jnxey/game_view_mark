import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const bounsConfigLists = getRequestGet({
  name: '彩金奖项列表',
  url: '/setting.game.bonus_config/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['cardinality', 'cash_rate', 'double_activity'])
});

export const bounsConfigSet = getRequestPost({ name: '设置彩金奖项', url: '/setting.game.bonus_config/set' });

export const bounsConfigDel = getRequestPost({ name: '删除彩金奖项', url: '/setting.game.bonus_config/del' });

export const bounsConfigStatus = getRequestPost({ name: '设置彩金奖项状态', url: '/setting.game.bonus_config/setStatus' });
