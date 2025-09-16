<template>
  <el-popover
    ref="popoverRef"
    placement="right-end"
    popper-class="scene-popover scene-table-currency"
    :title="$t('scene.enter.title_select_currency')"
    width="435px"
    :visible="visible"
    :virtual-ref="targetRef"
    virtual-triggering
  >
    <div class="table-currency flex-row flex-wrap align-center justify-between" @click.stop>
      <div
        class="currency-item flex-row align-center cursor-pointer mb-8 fz-18"
        v-for="(item, index) in currency"
        :key="index"
        @click="selectItem(item)"
      >
        <el-avatar :size="20" :src="getBaseImagUrl(item.image)" />
        <span class="ml-4">{{ item.abbreviation }}-</span>
        <span class="text-placeholder">{{ $ti(item.name) }}</span>
      </div>
    </div>
  </el-popover>
</template>
<script setup>
import { ref, shallowRef } from 'vue';
import { getBaseImagUrl } from '@/tools';
import { $ti } from '@/lang/input';
import { useWindowClick } from '@/hooks/click';
import { $t } from '@/lang/i18n';

const props = defineProps({ currency: Array });

const visible = ref(false);
const popoverRef = shallowRef();
const targetRef = shallowRef();
const emit = defineEmits(['select']);

let cacheCallback = null;

const open = (target, callback) => {
  if (visible.value && target === targetRef.value) return close();
  visible.value = true;
  targetRef.value = target;
  cacheCallback = callback;
};

const close = () => {
  cacheCallback = null;
  visible.value = false;
};

const selectItem = async (item) => {
  emit('select', item);
  if (cacheCallback) cacheCallback(item.id);
  close();
};

useWindowClick(() => close());

defineExpose({ open });
</script>
<style lang="scss" scoped>
.table-currency {
  margin-bottom: -8px;

  .currency-item {
    width: 200px;
    padding: 10px;
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
