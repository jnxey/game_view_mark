<template>
  <gv-popup ref="popupRef" :title="$t('game.kind.title_compose_sub_kind')" :async="true" width="600px" @close="handleClose">
    <div class="compose-add-wrap">
      <!--      -->
      <div class="select-wrap flex-row flex-wrap align-center">
        <div
          class="kind-item text-center cursor-pointer mr-8 mb-8"
          v-for="item in currentItems"
          :key="item.id"
          :class="{ disabled: disableMap[item.id] }"
          @click="selectItem(item)"
        >
          <el-avatar class="mb-4" :src="getBaseImagUrl(item.icon)" :size="40" />
          <div class="name">
            <span class="fz-12 fw-bold">{{ item.id }}:</span>
            <span class="fz-12 text-regular">{{ $ti(item.name) }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="close" size="large" round>{{ $t('common.close_btn') }}</el-button>
    </template>
  </gv-popup>
</template>
<script setup>
import GvPopup from '@/components/gv-popup/index.vue';
import { shallowRef } from 'vue';
import { getBaseImagUrl } from '@/tools';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const popupRef = shallowRef();
const currentItems = shallowRef([]);
const disableMap = shallowRef({});
let cacheCallback = null;

// 打开
const open = (list, disabled, callback) => {
  currentItems.value = list;
  disableMap.value = disabled ?? {};
  cacheCallback = callback;
  popupRef.value.open();
};

// 关闭
const close = () => {
  popupRef.value.close();
};

// 选中
const selectItem = (item) => {
  if (disableMap.value[item.id]) return;
  if (cacheCallback) cacheCallback(item);
  popupRef.value.close();
};

const handleClose = () => {
  cacheCallback = null;
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.compose-add-wrap {
  min-height: 300px;

  .kind-item {
    position: relative;
    width: 80px;
    padding: 10px;
    border: 2px solid var(--el-fill-color-dark);
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-fill-color-dark);

    &:hover {
      border-color: var(--el-color-primary);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      border-color: var(--el-fill-color-dark);
    }
  }
}
</style>
