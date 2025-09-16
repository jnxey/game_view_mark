<template>
  <div class="panel-window">
    <gv-material-picker
      size="30px"
      :show-bottom-btn="false"
      :model-value="windowConfig.backgroundImage"
      @update:model-value="(value) => setWindowConfig('backgroundImage', value)"
    />
    <el-select class="oid-select" :model-value="`${windowConfig.width}*${windowConfig.height}`" @change="handlerChange">
      <el-option v-for="item in WINDOW_OID" :key="item.name" :label="item.name" :value="item.name" />
    </el-select>
    <el-slider
      class="scale-slider"
      :model-value="windowConfig.scale"
      @input="(value) => setWindowConfig('scale', useSliderNumber(value))"
      :min="0.2"
      :max="2"
      :step="0.1"
    />
  </div>
</template>
<script>
export default { name: 'glc-panel-window' };
</script>
<script setup>
import { inject } from 'vue';
import { useSliderNumber } from './_hooks/number.js';
import { WINDOW_OID } from './_models/index.js';
import GvMaterialPicker from '@/components/gv-material/picker.vue';

const windowConfig = inject('windowConfig');
const setWindowConfig = inject('setWindowConfig');

const handlerChange = (value) => {
  const key = WINDOW_OID.findIndex((val) => val.name === value);
  if (!WINDOW_OID[key]) return;
  setWindowConfig('width', WINDOW_OID[key].width);
  setWindowConfig('height', WINDOW_OID[key].height);
};
</script>
<style scoped>
.panel-window {
  position: absolute;
  display: flex;
  align-items: center;
  bottom: 20px;
  right: 20px;
  z-index: 10;

  .scale-slider {
    width: 150px;
    margin-left: 10px;
  }

  .oid-select {
    width: 150px;
    margin-left: 10px;
  }

  .bg-input {
    width: 150px;
  }
}
</style>
