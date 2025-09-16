<template>
  <el-popover trigger="click" :width="state.popoverWidth">
    <template #reference>
      <el-input
        ref="inputRef"
        :model-value="modelValue"
        @input="(v) => handleSelect(v)"
        :placeholder="$t('components.gv_icon_picker.title')"
        :disabled="disabled"
        clearable
      >
        <template #append>
          <div class="flex-row align-center ml-12" v-if="modelValue">
            <el-tooltip :content="modelValue" placement="top">
              <gv-icon class="fz-16" :key="modelValue" :name="modelValue" />
            </el-tooltip>
          </div>
        </template>
      </el-input>
    </template>
    <div class="select-wrap">
      <div class="flex-row justify-between">
        <div class="mb-12">{{ $t('components.gv_icon_picker.title') }}</div>
        <div class="mb-12">
          <span
            v-for="(item, index) in iconTabsMap"
            :key="index"
            class="cursor-pointer fz-12 ml-4"
            :class="{ 'text-primary': index === tabIndex }"
            @click="tabIndex = index"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
      <el-scrollbar height="280px">
        <div class="flex-row flex-wrap">
          <div v-for="item in iconNamesFilter" :key="item" class="m-4">
            <el-button @click="handleSelect(item)">
              <gv-icon :name="item" class="fz-18" />
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>
<script>
export default { name: 'gv-picker' };
</script>
<script setup>
import { computed, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import { getElementPlusIconNames, getLocalIconNames } from './index';
import GvIcon from '@/components/gv-icon/index.vue';
import { $t } from '@/lang/i18n';

const props = defineProps({
  modelValue: String,
  disabled: { type: Boolean, default: false }
});

const emits = defineEmits(['update:modelValue', 'change']);

const inputRef = shallowRef();
const tabIndex = ref(0);
const state = reactive({ inputValue: '', popoverWidth: 300 });

const iconTabsMap = [
  { name: 'Element', icons: getElementPlusIconNames() },
  { name: 'Local', icons: getLocalIconNames() }
];

// 选中图标
const handleSelect = (icon) => {
  emits('update:modelValue', icon);
  emits('change', icon);
};

// 当前图标列表
const iconNamesFilter = computed(() => {
  return iconTabsMap[tabIndex.value]?.icons ?? [];
});

// 获取 input 的宽度
const getInputWidth = () => {
  nextTick(() => {
    const inputWidth = inputRef.value?.$el.offsetWidth;
    state.popoverWidth = inputWidth < 300 ? 300 : inputWidth;
  });
};

onMounted(() => {
  getInputWidth();
});
</script>
<style lang="scss" scoped>
.select-wrap {
}
</style>
