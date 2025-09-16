<template>
  <el-cascader v-model="content" :placeholder="$t('components.gv_select_perms.placeholder')" :options="permsList" clearable>
    <template #default="{ node, data }">
      <span class="fz-12">{{ data.name }}</span>
      <span class="fz-12 text-placeholder" v-if="data.title">（{{ data.title }}）</span>
    </template>
  </el-cascader>
</template>
<script>
export default { name: 'gv-select-perms' };
</script>
<script setup>
import { computed } from 'vue';
import { isEmpty } from '@/tools';
import { permsList, permsListMap } from '@/api/perms-list';
import { $t } from '@/lang/i18n';

const props = defineProps({ modelValue: { type: String, default: '' } });

const emit = defineEmits(['update:modelValue']);

const content = computed({
  get: () => {
    if (isEmpty(props.modelValue)) {
      return [];
    } else {
      const levels = permsListMap[props.modelValue]?.levels ?? [];
      const l1 = levels.slice(0, 1).join(',');
      const l2 = levels.slice(0, 2).join(',');
      return [l1, l2, props.modelValue];
    }
  },
  set: (value) => {
    if (isEmpty(value[2])) {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', value[2]);
    }
  }
});
</script>
