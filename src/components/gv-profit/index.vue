<template>
  <span class="gv-profit" :style="{ color }">{{ symbol }}{{ showValue }}</span>
</template>
<script>
export default {
  name: 'gv-profit'
};
</script>
<script setup>
import { computed } from 'vue';
import { formatThousand } from '@/tools';

const props = defineProps({
  symbol: String,
  // 值
  value: [String, Number],
  // 是否千分位
  thousand: { type: Boolean, default: true },
  // 为0时的颜色
  zeroColor: { type: String, default: '#000000' }
});

const formatValue = computed(() => Number(props.value));

// 显示的颜色
const color = computed(() => {
  const _value = formatValue.value;
  if (_value < 0) return '#fd0101';
  if (_value > 0) return '#06c325';
  if (_value === 0) return props.zeroColor;
});

// 显示的值
const showValue = computed(() => (!!props.thousand ? formatThousand(props.value) : props.value));
</script>
