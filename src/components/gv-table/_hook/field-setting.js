import { computed, ref } from 'vue';
import { storage } from '@/tools/storage.js';
import { CACHE_KEY_GV_TABLE_SETTING } from '@/values/cache.js';

function _getCacheSetting(key) {
  const setting = storage.get(CACHE_KEY_GV_TABLE_SETTING) || {};
  return setting[key] || {};
}

function _setCacheSetting(key, value) {
  const setting = storage.get(CACHE_KEY_GV_TABLE_SETTING) || {};
  setting[key] = value;
  storage.set(CACHE_KEY_GV_TABLE_SETTING, setting);
}

// 使用字段配置
export function useFieldSetting(getColumns, uniKey) {
  const handleSetting = ref(_getCacheSetting(uniKey));
  const formatColumns = computed(() => {
    const columns = getColumns();
    const list = columns.map((item, index) => {
      return { ...item, order: index, ...handleSetting.value[item.dataIndex] };
    });
    list.sort((a, b) => a.order - b.order);
    return list;
  });
  const setHandleSetting = (value) => {
    handleSetting.value = value;
    _setCacheSetting(uniKey, handleSetting.value);
  };
  return { formatColumns, handleSetting, setHandleSetting };
}
