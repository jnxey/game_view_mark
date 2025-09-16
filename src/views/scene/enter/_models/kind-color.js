import qs from 'qs';
import { GV_COLORS } from '@/values/colors';

export const getKindColor = (str) => {
  const def = GV_COLORS.blue;
  if (!str) return def;
  const key = str.indexOf('?');
  const query = qs.parse(str.slice(key + 1));
  return GV_COLORS[query.color] ?? def;
};
