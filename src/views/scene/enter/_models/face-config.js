import { getMultipleKey } from '@/tools';

export function formatFaceConfig(faceList, configMap) {
  const result = {};
  faceList.forEach((item) => {
    item.value = Number(item.value);
    const cur = configMap[item.currency_config_id];
    const key = getMultipleKey(cur.currency_id, cur.type);
    if (!result[key]) result[key] = [];
    result[key].push({ ...item });
  });
  Object.keys(result).forEach((id) => {
    result[id].sort((a, b) => a.value - b.value);
  });
  return result;
}
