import { LEVEL_COLOR_MAP } from '@/values';

export const getLevelColor = (level) => {
  return LEVEL_COLOR_MAP[level] ?? '#ffb200';
};
