import { GAME_KIND_LEVEL } from '@/values';

// 判断配置项是否是顶级
export function isTop(value) {
  return value === GAME_KIND_LEVEL.top;
}
