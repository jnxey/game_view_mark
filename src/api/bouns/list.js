import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const bonusListLists = getRequestGet({
  name: '彩金列表',
  url: '/setting.game.bonus/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['mini_amount'])
});

export const bonusListSet = getRequestPost({ name: '设置彩金', url: '/setting.game.bonus/set' });

export const bonusListGet = getRequestGet({ name: '获取彩金', url: '/setting.game.bonus/get' });

export const bonusListDel = getRequestPost({ name: '删除彩金', url: '/setting.game.bonus/del' });

export const bonusListStatus = getRequestPost({ name: '设置彩金状态', url: '/setting.game.bonus/setStatus' });

export const bonusDiyUIList = getRequestGet({ name: '获取彩金大屏', url: '/setting.game.bonus/diyUIList' });

export const bonusDiyUISet = getRequestPost({ name: '设置彩金大屏', url: '/setting.game.bonus/diyUI' });
