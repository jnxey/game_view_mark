<template>
  <div @mouseenter="inPopover = true" @mouseleave="inPopover = false">
    <el-popover
      placement="top"
      v-model:visible="visible"
      :width="width"
      trigger="contextmenu"
      class="popover-input"
      :teleported="teleported"
      :persistent="false"
      popper-class="!p-0"
    >
      <div class="flex p-3" @click.stop="">
        <div class="popover-input__input mb-8 flex-1">
          <el-select class="flex-1" :size="size" v-if="type === 'select'" v-model="inputValue" :teleported="teleported">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input
            v-else
            v-trim
            v-model="inputValue"
            :maxlength="limit"
            :show-word-limit="showLimit"
            :type="type"
            :size="size"
            clearable
            :placeholder="placeholder"
          />
        </div>
        <div class="popover-input__btns flex-none">
          <el-button link @click="close">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :size="size" @click="handleConfirm">{{ $t('common.confirm_btn') }}</el-button>
        </div>
      </div>
      <template #reference>
        <div class="inline" @click.stop="handleOpen">
          <slot></slot>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script>
export default { name: 'gv-popover-input' };
</script>
<script setup>
import { useEventListener } from '@vueuse/core';
import { ref, watch } from 'vue';
import { $t } from '@/lang/i18n';

const props = defineProps({
  value: { type: String },
  type: { type: String, default: 'text' },
  width: { type: [Number, String], default: '300px' },
  placeholder: String,
  disabled: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'default' },
  limit: { type: Number, default: 200 },
  showLimit: { type: Boolean, default: false },
  teleported: { type: Boolean, default: true }
});
const emit = defineEmits(['confirm']);
const visible = ref(false);
const inPopover = ref(false);
const inputValue = ref();
const handleConfirm = () => {
  close();
  emit('confirm', inputValue.value);
};
const handleOpen = () => {
  if (props.disabled) {
    return;
  }
  visible.value = true;
};
const close = () => {
  visible.value = false;
};

watch(
  () => props.value,
  (value) => {
    inputValue.value = value;
  },
  {
    immediate: true
  }
);

useEventListener(document.documentElement, 'click', () => {
  if (inPopover.value) return;
  close();
});
</script>

<style scoped lang="scss"></style>
