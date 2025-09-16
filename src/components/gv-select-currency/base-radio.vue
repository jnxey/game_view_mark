<template>
  <div class="currency-base-button flex-row flex-wrap align-center p-4">
    <div
      class="currency-item flex-row align-center cursor-pointer pl-4 pr-4"
      v-for="(item, index) in currency"
      :key="index"
      :class="{ active: item.id === modelValue }"
      @click="selectItem(item)"
    >
      <el-avatar :size="18" :src="getBaseImagUrl(item.image)" />
      <span class="ml-4">{{ item.abbreviation }}-</span>
      <span class="text-placeholder">{{ $ti(item.name) }}</span>
    </div>
  </div>
</template>
<script>
export default { name: 'gv-select-currency-base-radio' };
</script>
<script setup>
import { computed, nextTick } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import { getBaseImagUrl } from '@/tools';
import { $ti } from '@/lang/input';
import { YES_NO_VALUE } from '@/values';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  clearable: { type: Boolean, default: true },
  disabled: Boolean,
  disabledOption: { type: Object, default: () => new Object() },
  options: Array,
  virtual: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const { optionsData, refresh } = useDictOptions(
  { base: { api: currencyBaseLists, params: { virtual_status: props.virtual ? null : YES_NO_VALUE.no } } },
  !!props.options
);

const currency = computed(() => {
  if (!!props.options) return props.options;
  return optionsData.base;
});

const selectItem = async (item) => {
  emit('update:modelValue', item.id);
  await nextTick();
  emit('change', item.id);
};

defineExpose({ refresh });
</script>
<style lang="scss" scoped>
.currency-base-button {
  .currency-item {
    min-width: 120px;
    height: 32px;
    border: 4px solid transparent;
    &.active {
      border-radius: 18px;
      background-color: var(--el-color-primary);
      color: var(--el-color-primary);
      border-color: var(--el-color-primary-light-8);
      span {
        color: var(--el-fill-color);
      }

      &:after {
      }
    }
  }
}
</style>
