<template>
  <gv-popup
    ref="popupRef"
    :title="$t('scene.enter.title_select_bonus')"
    width="460px"
    :confirm-button-text="null"
    :cancel-button-text="null"
    @close="cacheCallback = null"
  >
    <div class="table-bonus">
      <div
        v-for="(item, index) in bonusList"
        :key="item.id"
        class="bonus-item flex-row align-center mb-8 fz-14 text-main cursor-pointer"
        :class="{ active: current === item.id }"
        @click="selectItem(item)"
      >
        <div class="index">
          <template v-if="current === item.id">
            <gv-icon name="el-icon-success-filled" class="fz-14" />
          </template>
          <template v-else>
            {{ index + 1 }}
          </template>
        </div>
        <div class="name flex-1">{{ $ti(item.name) }}</div>
        <div class="amount text-right">{{ calcAmount(item.prize_pool) }}</div>
      </div>
    </div>
  </gv-popup>
</template>
<script setup>
import { inject, ref, shallowRef } from 'vue';
import GvPopup from '@/components/gv-popup/index.vue';
import { calcAmount } from '@/tools';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const bonusList = inject('bonusList');

const props = defineProps({ options: Array });
const current = ref();
const popupRef = shallowRef();
const emit = defineEmits(['select']);

let cacheCallback = null;

const open = (value, callback) => {
  current.value = value;
  popupRef.value?.open();
  cacheCallback = callback;
};

const selectItem = async (item) => {
  emit('select', item);
  const id = item.id === current.value ? null : item.id;
  if (cacheCallback) cacheCallback(id);
  popupRef.value?.close();
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.table-bonus {
  .bonus-item {
    height: 40px;
    padding: 0 15px;
    border-radius: var(--gv-border-radius-mid);
    background-color: var(--el-color-primary-light-9);

    &.active {
      color: var(--el-primary-text-color);
      background-color: var(--el-color-primary);
    }

    .index {
      width: 25px;
    }

    .name {
      word-break: keep-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .amount {
      min-width: 60px;
    }
  }
}
</style>
