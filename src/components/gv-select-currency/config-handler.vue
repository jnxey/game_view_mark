<template>
  <el-checkbox-group v-model="content">
    <el-checkbox class="custom-checkbox hide-selected-icon" v-for="(item, index) in optionsList" :key="index" :value="item.id">
      <div class="flex-row align-center">
        <el-avatar :size="18" :src="getBaseImagUrl(item.image)" />
        <span class="ml-4">{{ $ti(item.name) }}</span>
      </div>
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default { name: 'gv-select-currency-config-handler' };
</script>
<script setup>
import { computed } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { getBaseImagUrl, isEmpty } from '@/tools';
import { $ti } from '@/lang/input';
import { YES_NO_VALUE } from '@/values';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  atLeastOne: { type: Boolean, default: false }, // 最少1个
  muted: { type: Boolean, default: false }, //互斥
  options: Array,
  virtual: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const { optionsData, refresh } = useDictOptions(
  {
    list: {
      api: currencyConfigLists,
      params: { ...(props.params ?? {}), virtual_status: props.virtual ? null : YES_NO_VALUE.no }
    }
  },
  !!props.options
);

const optionsList = computed(() => {
  return !!props.options ? props.options : optionsData.list;
});

const formatValue = (list) => {
  return list.map((val) => Number(val));
};

const getValue = (value) => {
  return formatValue(String(value).split(','));
};

const setValue = (value) => {
  const rValue = value.join(',');
  if (!rValue && props.atLeastOne) {
    return props.modelValue;
  } else {
    return rValue;
  }
};

const content = computed({
  get: () => {
    const _value = props.modelValue;
    if (!!props.options) {
      return isEmpty(_value) ? [] : getValue(_value);
    } else {
      return !_value ? [] : getValue(_value);
    }
  },
  set: (value) => {
    const _value = setValue(value);
    if (!!props.options) {
      isEmpty(_value) ? emit('update:modelValue', null) : emit('update:modelValue', _value);
    } else {
      !_value ? emit('update:modelValue', null) : emit('update:modelValue', _value);
    }
  }
});

const valueChange = (val) => {
  emit('change', val);
};

defineExpose({ refresh });
</script>
