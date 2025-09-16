<template>
  <div v-for="(item, index) in getOptions" :key="index">
    <span>{{ index !== 0 ? '、' : '' }}{{ item[config.label] }}</span>
  </div>
</template>
<script>
export default { name: 'gv-dict-value' };
</script>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  value,
  options: { type: Array, default: () => [] },
  config: {
    type: Object,
    default: () => ({ label: 'name', value: 'value' })
  }
});

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : String(props.value).split(',');
  } else {
    return [];
  }
});

const getOptions = computed(() => {
  return props.options.filter((item) => values.value.includes(item[props.config.value]));
});
</script>
