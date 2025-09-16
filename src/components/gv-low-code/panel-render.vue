<template>
  <template v-for="(temp, index) in schema" :key="temp.uid">
    <component :is="getWidgetComponent(temp.mark)" :config="temp.config" :extend="temp.extend" :uid="temp.uid" :index="index" />
  </template>
  <div v-if="!!bLine.x" class="guide-line-x" :style="{ left: getPX(bLine.x) }" />
  <div v-if="!!bLine.y" class="guide-line-y" :style="{ top: getPX(bLine.y) }" />
</template>
<script>
export default { name: 'glc-panel-render' };
</script>
<script setup>
import { inject, provide, reactive } from 'vue';
import { getWidgetComponent } from './_models/index.js';
import { getPX } from '@/tools';

const schema = inject('schema');

const bLine = reactive({ x: null, y: null });

const setBLine = (val) => {
  bLine.x = val.x;
  bLine.y = val.y;
};

provide('setBLine', setBLine);
</script>
<style scoped lang="scss">
.guide-line-x {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 2px dashed var(--el-color-success);
  z-index: var(--gv-command-z-index);
}
.guide-line-y {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  border-top: 2px dashed var(--el-color-success);
  z-index: var(--gv-command-z-index);
}
</style>
