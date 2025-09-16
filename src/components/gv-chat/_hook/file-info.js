import qs from 'qs';
import { checkIndexArray } from '@/tools';

export function useFileInfo(src) {
  const def = { name: '...' + String(src).slice(-15), size: 0 };
  if (!src) return def;
  const key = src.indexOf('?');
  const info = checkIndexArray(key) ? qs.parse(src.slice(key + 1)) : def;
  return { name: '...' + String(info.name).slice(-25), size: Number(info.size / 1024).toFixed(2) };
}
