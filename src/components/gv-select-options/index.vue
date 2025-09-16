<template>
  <el-select
    v-model="content"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    v-place="placeTop"
    :disabled="disabled"
    :filterable="filterable"
    :popper-class="isMutiCol && !groupOptions ? 'gv-select-options-multi' : ''"
  >
    <template v-if="!!groupOptions">
      <el-option-group v-for="group in groupOptions.dict" :key="group.value" :label="group.name">
        <template v-for="(item, index) in optionsList" :key="index">
          <el-option
            v-if="group.value === item[groupOptions.field]"
            :label="$ti(!!nameField ? item[nameField] : item.name)"
            :value="!!valueField ? item[valueField] : (item.id ?? item.value)"
          />
        </template>
      </el-option-group>
    </template>
    <template v-else>
      <el-option
        v-for="(item, index) in optionsList"
        :key="index"
        :label="$ti(!!nameField ? item[nameField] : item.name)"
        :value="!!valueField ? item[valueField] : (item.id ?? item.value)"
      />
    </template>

    <template #empty v-if="!!emptyPage">
      <el-button link type="primary" v-perms="[emptyPage.perm]" @click="toRoutePath(emptyPage.perm)">
        {{ $t('common.ins_btn') }}《{{ emptyPage.title ?? placeholder }}》
      </el-button>
    </template>
  </el-select>
</template>
<script>
export default { name: 'gv-select-options' };
</script>
<script setup>
import { computed } from 'vue';
import { useDictOptions } from '@/hooks/dict';
import { isEmpty } from '@/tools';
import { toRoutePath } from '@/router';
import { $t } from '@/lang/i18n';
import { $ti } from '@/lang/input';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  request: { type: Function, default: () => function () {} },
  placeholder: String,
  clearable: { type: Boolean, default: true },
  placeTop: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  groupOptions: Object,
  nameField: String,
  valueField: String,
  emptyPage: Object,
  options: Array
});

const emit = defineEmits(['update:modelValue']);

const { optionsData, refresh } = useDictOptions({ list: { api: props.request } }, !!props.options);

const optionsList = computed(() => {
  return !!props.options ? props.options : optionsData.list;
});

const isMutiCol = computed(() => {
  return (optionsList.value?.length ?? 0) > 16;
});

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

defineExpose({ refresh });
</script>
<style lang="scss">
.gv-select-options-multi .el-select-dropdown__list {
  column-count: 3; /* 控制列数 */
  column-gap: 10px; /* 列间距 */
}
.gv-select-options-multi .el-select-dropdown__item {
  break-inside: avoid; /* 防止选项跨列断裂 */
}
</style>
