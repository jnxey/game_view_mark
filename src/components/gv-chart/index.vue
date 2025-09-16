<template>
  <div class="chart" ref="canvasEl"></div>
</template>
<script>
export default { name: 'gv-chart' };
</script>
<script setup>
import * as echarts from 'echarts';
import { defineProps, defineExpose, onMounted, shallowRef } from 'vue';
import { useListenResize } from '@/hooks/resize.js';

const canvasEl = shallowRef(null);
let currentChart = null;

const props = defineProps({ options: Object });

onMounted(function () {
  currentChart = echarts.init(canvasEl.value, null, { renderer: 'svg' });
  if (props.options) currentChart.setOption(props.options);
});

const resetChart = () => {
  currentChart?.setOption(props.options);
};

useListenResize(() => {
  currentChart.resize();
});

defineExpose({ resetChart });
</script>
