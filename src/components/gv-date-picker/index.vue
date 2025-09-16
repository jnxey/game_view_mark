<template>
  <el-date-picker class="gv-dater-picker" v-model="content" :type="type" :placeholder="placeholder" :value-format="valueFormat" clearable />
</template>
<script>
export default { name: 'gv-date-picker' };
</script>
<script setup>
import { computed } from 'vue';
import { isEmpty } from '@/tools';
import { $t } from '@/lang/i18n';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'datetime' },
  placeholder: { type: String, default: $t('components.gv_date_picker.placeholder') },
  valueFormat: { type: String, default: 'x' },
  clearable: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue']);

const inValue = (value) => {
  if (value && props.valueFormat === 'x') {
    return value * 1000;
  } else {
    return value;
  }
};

const outValue = (value) => {
  if (value && props.valueFormat === 'x') {
    return Math.floor(value / 1000);
  } else {
    return value;
  }
};

const content = computed({
  get: () => {
    if (isEmpty(props.modelValue)) {
      return '';
    } else {
      return inValue(props.modelValue);
    }
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', outValue(value));
    }
  }
});
</script>
<style scoped lang="scss">
.gv-daterange-picker {
}
</style>
