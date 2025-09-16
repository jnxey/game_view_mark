<template>
  <el-input-number
    v-model="inputValue"
    @input="setValue"
    @blur="handleBlur"
    :min="min"
    :max="max"
    :controls="controls"
    :size="size"
    :step="step"
    :step-strictly="stepStrictly"
    :placeholder="placeholderText"
    :controls-position="controlsPosition"
    :data-command="dataCommand"
    :data-command-value="modelValue"
  >
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
    </template>
  </el-input-number>
</template>
<script>
export default { name: 'gv-input-amount-placeholder' };
</script>
<script setup>
import { computed, nextTick, ref } from 'vue';
import { isEmpty } from '@/tools';

const props = defineProps({
  min: Number,
  max: Number,
  step: Number,
  size: String,
  modelValue: Number,
  stepStrictly: Boolean,
  placeholder: String,
  controlsPosition: String,
  dataCommand: String,
  negative: { type: Boolean, default: false },
  controls: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref();

const placeholderText = computed(() =>
  isEmpty(props.modelValue) ? props.placeholder : String(props.negative ? Math.abs(props.modelValue) : props.modelValue)
);

const setValue = (value) => {
  if (isEmpty(value)) {
    emit('update:modelValue', null);
  } else {
    emit('update:modelValue', props.negative ? -1 * value : value);
  }
};

const handleBlur = async () => {
  await nextTick();
  if (!isEmpty(inputValue.value)) setValue(inputValue.value); // 为触发格式化
  inputValue.value = null;
};
</script>
<style scoped lang="scss">
.el-input-number {
  ::v-deep(.el-input__wrapper) {
    .el-input__inner {
      color: var(--el-text-color-primary);
    }
    .el-input__inner::placeholder {
      color: var(--el-text-color-primary);
    }
    &.is-focus {
      .el-input__inner::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
