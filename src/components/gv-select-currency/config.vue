<template>
  <el-select
    v-model="content"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @change="valueChange"
    :multiple="multiple"
    v-place="placeTop"
  >
    <template #label="{ label, value }">
      <div v-if="currencyMap[value]" class="flex-row align-center">
        <el-avatar :size="18" :src="getBaseImagUrl(currencyMap[value].image)" />
        <span class="ml-12">{{ $ti(currencyMap[value].name) }}</span>
        -
        <span class="text-placeholder">{{ currencyMap[value].abbreviation }}</span>
      </div>
      <span v-else>{{ label }}</span>
    </template>
    <el-option
      v-for="(item, index) in optionsList"
      :key="index"
      :label="item.name"
      :value="item.id"
      :disabled="disabledOption[item.id] || disabledSelected[item.id]"
    >
      <div class="flex-row align-center">
        <el-avatar :size="18" :src="getBaseImagUrl(item.image)" />
        <span class="ml-12">{{ $ti(item.name) }}</span>
        -
        <span class="text-placeholder">{{ item.abbreviation }}</span>
      </div>
    </el-option>
    <template #empty>
      <el-button link type="primary" @click="toRoutePath(permsMap.currency.config.view)">{{ $t('components.gv_select_currency.to_add') }}</el-button>
    </template>
  </el-select>
</template>
<script>
export default { name: 'gv-select-currency-config' };
</script>
<script setup>
import { computed } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyConfigLists } from '@/api/currency/config';
import { getBaseImagUrl, isEmpty, mappingArrayToObject } from '@/tools';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { $ti } from '@/lang/input';
import { YES_NO_VALUE } from '@/values';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '请选择币种' },
  clearable: { type: Boolean, default: true },
  placeTop: { type: Boolean, default: false },
  disabled: Boolean,
  disabledOption: { type: Object, default: () => new Object() },
  params: { type: Object, default: () => new Object() },
  multiple: { type: Boolean, default: false },
  muted: { type: Boolean, default: false }, //互斥
  options: Array,
  virtual: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const { optionsData, refresh } = useDictOptions(
  { list: { api: currencyConfigLists, params: { ...(props.params ?? {}), virtual_status: props.virtual ? null : YES_NO_VALUE.no } } },
  !!props.options
);

const optionsList = computed(() => {
  return !!props.options ? props.options : optionsData.list;
});

const optionsMap = computed(() => mappingArrayToObject(optionsList.value));

const disabledSelected = computed(() => {
  const result = {};
  if (!props.multiple || !optionsList.value || !props.muted) return result;
  const first = optionsMap.value[content.value?.[0]];
  if (!first) return result;
  optionsList.value?.forEach((item) => {
    if (item.currency_id !== first.currency_id) result[item.id] = true;
  });
  return result;
});

const currencyMap = computed(() => mappingArrayToObject(optionsList.value ?? []));

const formatValue = (list) => {
  return list.map((val) => Number(val));
};

const getValue = (value) => {
  return props.multiple ? formatValue(String(value).split(',')) : value;
};

const setValue = (value) => {
  return props.multiple ? value.join(',') : value;
};

const content = computed({
  get: () => {
    const _value = props.modelValue;
    if (!!props.options) {
      return isEmpty(_value) ? null : getValue(_value);
    } else {
      return !_value ? null : getValue(_value);
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
