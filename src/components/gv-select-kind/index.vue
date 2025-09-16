<template>
  <el-checkbox-group v-model="content">
    <el-checkbox v-for="(item, index) in optionsData.kind" :key="index" :label="item.name" :value="item.id" />
  </el-checkbox-group>
</template>
<script>
export default { name: 'gv-select-kind' };
</script>
<script setup>
import { computed } from 'vue';
import { isEmpty } from '@/tools';
import { useDictOptions } from '@/hooks/dict';
import { gameKindLists } from '@/api/game/kind';

const props = defineProps({
  modelValue: { type: Array, default: [] }
});

const emit = defineEmits(['update:modelValue']);

const { optionsData, refresh } = useDictOptions({ kind: { api: gameKindLists } });

const getKindList = () => {
  return optionsData.kind ?? [];
};

const content = computed({
  get: () => {
    if (isEmpty(props.modelValue)) {
      return [];
    } else {
      return props.modelValue;
    }
  },
  set: (value) => {
    if (isEmpty(value)) {
      emit('update:modelValue', []);
    } else {
      emit('update:modelValue', value);
    }
  }
});

defineExpose({ refresh, getKindList });
</script>
