<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_select_niuniu_open')"
    width="460px"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
  >
    <div class="road-niuniu-card flex-row flex-wrap align-center justify-around">
      <div
        class="seat-item flex-col align-center cursor-pointer mb-8"
        v-for="(item, index) in ROAD_NIUNIU_CARD_DICT"
        :key="index"
        @click="selectItem(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import { shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { ROAD_NIUNIU_CARD_DICT } from '@/values/road';
import { $t } from '@/lang/i18n';

const props = defineProps({ options: Array });
const popupRef = shallowRef();
const emit = defineEmits(['select']);

let cacheCallback = null;

const open = (callback) => {
  popupRef.value?.open();
  cacheCallback = callback;
};

const selectItem = async (item) => {
  emit('select', item);
  if (cacheCallback) cacheCallback(item);
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.road-niuniu-card {
  .seat-item {
    width: 100px;
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
