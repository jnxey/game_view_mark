<template>
  <div class="gv-input-amount">
    <template v-if="$slots['amount-show']">
      <slot name="amount-show" :amount="content" :format="formatAmount" />
    </template>
    <template v-else>
      <div class="format-amount fw-bold text-main text-center">{{ formatAmount }}</div>
    </template>
    <slot name="handler-top" />
    <div class="flex-row align-bottom">
      <slot name="handler-box" />
      <el-input-number
        v-model="content"
        :min="0"
        :max="Number.MAX_SAFE_INTEGER"
        :precision="precision"
        :step="step"
        :controls="!$slots['handler-suffix']"
        controls-position="right"
        :placeholder="placeholder"
        autofocus
        class="flex-1"
        :class="{ 'has-bottom': $slots['handler-bottom'] }"
        size="large"
      >
        <template #prefix v-if="prefix">
          <span class="pr-4">{{ prefix }}</span>
        </template>
        <template #suffix v-if="$slots['handler-suffix']">
          <slot name="handler-suffix" />
        </template>
      </el-input-number>
    </div>
    <div class="handler-bottom" v-if="$slots['handler-bottom']">
      <slot name="handler-bottom" />
    </div>
  </div>
</template>
<script>
export default { name: 'gv-input-amount' };
</script>
<script setup>
import { computed } from 'vue';
import { formatThousand, isEmpty } from '@/tools';

const props = defineProps({
  modelValue: { type: [Number, String], default: '' },
  placeholder: String,
  precision: { type: Number, default: 2 },
  step: { type: Number, default: 1 },
  prefix: String
});

const emit = defineEmits(['update:modelValue']);

const formatAmount = computed(() => formatThousand(content.value || 0));

const content = computed({
  get: () => {
    if (isEmpty(props.modelValue)) {
      return null;
    } else {
      return props.modelValue;
    }
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:modelValue', null);
    } else {
      emit('update:modelValue', value);
    }
  }
});
</script>
<style lang="scss" scoped>
.gv-input-amount {
  .format-amount {
    padding: 20px 10px;
    font-size: 48px;
  }

  ::v-deep(.el-input-number) {
    &.has-bottom {
      font-weight: 700;
      .el-input {
        .el-input__wrapper {
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }

  .handler-bottom {
    min-height: 32px;
    border-bottom-right-radius: var(--el-border-radius-base);
    border-bottom-left-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color);
    border-top: 0;
  }
}
</style>
