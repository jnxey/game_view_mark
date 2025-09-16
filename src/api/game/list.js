import { getRequestGet, getRequestPost } from '@/tools/request';
import { pipeToNumber } from '@/tools/pipe-format';

export const gameLists = getRequestGet({ name: '游戏列表', url: '/setting.game.game/lists' });

export const gameSet = getRequestPost({ name: '设置游戏', url: '/setting.game.game/set', logRefresh: true });

export const gameDel = getRequestPost({ name: '删除游戏', url: '/setting.game.game/del', logRefresh: true });

export const gameGet = getRequestGet({ name: '获取游戏信息', url: '/setting.game.game/get' });

export const gameStatus = getRequestPost({ name: '设置游戏状态', url: '/setting.game.game/setStatus', logRefresh: true });

export const gameConfigLists = getRequestGet({
  name: '游戏配置列表',
  url: '/setting.game.game_config/lists',
  pipeFormat: (data) => pipeToNumber(data.lists, ['odds', 'rake'])
});

export const gameConfigSet = getRequestPost({ name: '设置游戏配置', url: '/setting.game.game_config/set', logRefresh: true });

export const gameConfigPreDetection = getRequestPost({ name: '设置游戏录入检测', url: '/setting.game.game/isPreDetection' });

export const gameConfigGetDetection = getRequestPost({ name: '获取游戏录入检测', url: '/setting.game.game/getPreDetection' });

export const gameLastLog = getRequestGet({ name: '游戏列表操作记录', url: '/setting.game.game/lastLog' });
