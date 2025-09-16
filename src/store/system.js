import { reactive, watch } from 'vue';
import { storage } from '@/tools/storage.js';
import { CACHE_KEY_SYSTEM } from '@/values/cache.js';
import { syncObjectData } from '@/tools/index.js';
import { getConfig } from '@/api/common.js';
import { LAYOUT_SKIN_COLOR, LAYOUT_SKIN_TYPE } from '@/values';

const initValue = storage.get(CACHE_KEY_SYSTEM) ?? {};

export const systemState = reactive({
  config: {},
  menuCollapse: false,
  skinType: LAYOUT_SKIN_TYPE.themeLight,
  skinColor: LAYOUT_SKIN_COLOR.blue,
  keyboard: false,
  ...initValue
});

// 同步系统设置
export function setSystemState(obj) {
  syncObjectData(systemState, obj);
  storage.set(CACHE_KEY_SYSTEM, systemState);
}

// 拉去系统设置
export function getSystemConfig() {
  return new Promise((resolve, reject) => {
    getConfig()
      .then((data) => {
        systemState.config = data;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// 监听皮肤设置修改
export function watchSkin() {
  watch(
    () => systemState.skinType,
    (value, oldValue) => {
      if (!!oldValue) document.documentElement.classList.remove(oldValue);
      if (!!value) document.documentElement.classList.add(value);
    },
    { deep: true, immediate: true }
  );
  watch(
    () => systemState.skinColor,
    (value, oldValue) => {
      if (!!oldValue) document.documentElement.classList.remove(oldValue);
      if (!!value) document.documentElement.classList.add(value);
    },
    { deep: true, immediate: true }
  );
}
