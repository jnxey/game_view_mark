<template>
  <el-select v-model="content" :placeholder="placeholder" :clearable="clearable" :disabled="disabled" @change="valueChange">
    <template #label="{ label, value }">
      <div v-if="currencyMap[value]" class="flex-row align-center">
        <el-avatar :size="18" :src="getBaseImagUrl(currencyMap[value].image)" />
        <span class="ml-12">{{ currencyMap[value].abbreviation }}-</span>
        <span class="text-placeholder">{{ $ti(currencyMap[value].name) }}</span>
      </div>
      <span v-else>{{ label }}</span>
    </template>
    <el-option v-for="(item, index) in optionsList" :key="index" :label="item.name" :value="item.id" :disabled="disabledOption[item.id]">
      <div class="flex-row align-center">
        <el-avatar :size="18" :src="getBaseImagUrl(item.image)" />
        <span class="ml-12">{{ item.abbreviation }}-</span>
        <span class="text-placeholder">{{ $ti(item.name) }}</span>
      </div>
    </el-option>
    <template #empty>
      <el-button link type="primary" @click="toRoutePath(permsMap.currency.base.view)">{{ $t('components.gv_select_currency.to_add') }}</el-button>
    </template>
  </el-select>
</template>
<script>
export default { name: 'gv-select-currency-base' };
</script>
<script setup>
import { computed } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { currencyBaseLists } from '@/api/currency/base';
import { getBaseImagUrl, mappingArrayToObject } from '@/tools';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { permsMap } from '@/api/perms';
import { $ti } from '@/lang/input';
import { YES_NO_VALUE } from '@/values';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: $t('components.gv_select_currency.placeholder') },
  clearable: { type: Boolean, default: true },
  disabled: Boolean,
  disabledOption: { type: Object, default: () => new Object() },
  virtual: { type: Boolean, default: false },
  options: Array
});

const emit = defineEmits(['update:modelValue', 'change']);

const { optionsData, refresh } = useDictOptions(
  { list: { api: currencyBaseLists, params: { virtual_status: props.virtual ? null : YES_NO_VALUE.no } } },
  !!props.options
);

const optionsList = computed(() => {
  return !!props.options ? props.options : optionsData.list;
});

const currencyMap = computed(() => mappingArrayToObject(optionsList.value ?? []));

const content = computed({
  get: () => {
    if (!props.modelValue) {
      return null;
    } else {
      return props.modelValue;
    }
  },
  set: (value) => {
    if (!value) {
      emit('update:modelValue', null);
    } else {
      emit('update:modelValue', value);
    }
  }
});

const valueChange = (val) => {
  emit('change', val);
};

defineExpose({ refresh });
</script>
