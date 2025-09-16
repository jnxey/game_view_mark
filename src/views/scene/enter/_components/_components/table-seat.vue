<template>
  <el-popover
    ref="popoverRef"
    placement="right-end"
    width="350px"
    popper-class="scene-popover"
    :title="$t('scene.enter.title_select_seat')"
    :visible="visible"
    :virtual-ref="targetRef"
    virtual-triggering
  >
    <div class="table-seat flex-row flex-wrap align-center justify-between" @click.stop>
      <div class="seat-item flex-col align-center cursor-pointer mb-8 fz-20" v-for="(item, index) in seatList" :key="index" @click="selectItem(item)">
        {{ item }}
      </div>
    </div>
  </el-popover>
  >
</template>
<script setup>
import { ref, shallowRef } from 'vue';
import { useWindowClick } from '@/hooks/click';
import { $t } from '@/lang/i18n';

const visible = ref(false);
const popoverRef = shallowRef();
const targetRef = shallowRef();
const emit = defineEmits(['select']);

let cacheCallback = null;

const seatList = shallowRef([]);

const open = (target, callback) => {
  if (visible.value && target === targetRef.value) return close();
  visible.value = true;
  seatList.value = initSeatList();
  targetRef.value = target;
  cacheCallback = callback;
};

const close = () => {
  cacheCallback = null;
  visible.value = false;
};

const initSeatList = () => {
  const result = [];
  Array.from({ length: 7 }).map((_, index) => {
    if (index + 1 !== 4) result.push(index + 1);
  });
  return result;
};

const selectItem = async (item) => {
  emit('select', item);
  if (cacheCallback) cacheCallback(item);
  close();
};

useWindowClick(() => close());

defineExpose({ open });
</script>
<style lang="scss" scoped>
.table-seat {
  .seat-item {
    width: 100px;
    padding: 15px;
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
