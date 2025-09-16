<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_select_multiple')"
    width="460px"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
  >
    <div class="kind-select">
      <el-row :gutter="10">
        <el-col :span="6" v-for="(item, index) in kindList" :key="index">
          <div class="kind-item flex-col align-center cursor-pointer mb-8" @click="selectItem(item)">
            {{ $ti(item.name) }}
          </div>
        </el-col>
      </el-row>
    </div>
  </gv-popup>
</template>
<script setup>
import { shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const props = defineProps({ options: Array });
const popupRef = shallowRef();
const emit = defineEmits(['select']);

let cacheCallback = null;

const kindList = shallowRef([]);

const open = (callback, list) => {
  popupRef.value?.open();
  kindList.value = list;
  cacheCallback = callback;
};

const selectItem = async (item) => {
  emit('select', item.id);
  if (cacheCallback) cacheCallback(item);
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.kind-select {
  overflow: hidden;
  .kind-item {
    padding: 20px 10px;
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--el-fill-color);

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
