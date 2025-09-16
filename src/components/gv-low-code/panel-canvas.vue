<template>
  <div class="panel-canvas-wrap">
    <div class="panel-canvas" ref="elRef">
      <div
        class="canvas-content"
        :style="{
          top: getPX(windowConfig.top),
          left: getPX(windowConfig.left),
          width: getPX(windowConfig.width),
          height: getPX(windowConfig.height),
          backgroundImage: `url(${windowConfig.backgroundImage})`,
          backgroundColor: windowConfig.backgroundColor,
          transform: `scale(${windowConfig.scale})`
        }"
        @dragover.prevent
        @drop="handleDrop"
      >
        <glc-panel-render :schema="schema" />
        <slot name="content" />
      </div>
    </div>
    <glc-panel-widgets>
      <slot name="widgets" />
    </glc-panel-widgets>
    <glc-panel-attribute v-if="current" />
    <glc-panel-window />
  </div>
</template>
<script>
export default { name: 'glc-panel-canvas' };
</script>
<script setup>
import { computed, onMounted, provide, reactive, ref, shallowRef, toRaw } from 'vue';
import { getPX } from '@/tools/index.js';
import { useDrag } from './_hooks/drag.js';
import { GLC_COLORS } from './_models/index.js';
import { useZoom } from './_hooks/zoom.js';
import GlcPanelWidgets from './panel-widgets.vue';
import GlcPanelAttribute from './panel-attribute.vue';
import { useHandler } from './_hooks/handler.js';
import GlcPanelRender from './panel-render.vue';
import GlcPanelWindow from './panel-window.vue';

const elRef = shallowRef();

const windowConfig = reactive({
  width: 1920,
  height: 1080,
  top: 0,
  left: 0,
  backgroundImage: '',
  backgroundColor: GLC_COLORS.white,
  scale: 1
});

const { current, setCurrent, schema, setSchema, addSchema, resetSchema, setZIndex, isEnterSpace, handleDrop } = useHandler(
  () => elRef.value,
  () => windowConfig
);

const { resetScale } = useZoom(elRef, { defScale: windowConfig.scale, setScale: (scale) => (windowConfig.scale = scale) });

const { setDragDom } = useDrag(
  () => isEnterSpace.value,
  (pointer) => {
    windowConfig.top = pointer.y;
    windowConfig.left = pointer.x;
  },
  () => 1,
  () => ({ x: windowConfig.left, y: windowConfig.top })
);

const setWindowConfig = (field, value) => {
  windowConfig[field] = value;
};

const getConfig = () => {
  return { window: toRaw(windowConfig), schema: toRaw(schema) };
};

const setConfig = (config) => {
  Object.keys(config.window).forEach((name) => {
    windowConfig[name] = config.window[name];
  });
  resetSchema(config.schema ?? []);
  resetScale(windowConfig.scale);
};

onMounted(() => setDragDom(elRef.value));

defineExpose({ getConfig, setConfig });

provide('schema', schema);
//
provide('windowConfig', windowConfig);
provide('setWindowConfig', setWindowConfig);
provide('isEnterSpace', isEnterSpace);
provide('current', current);
provide('setCurrent', setCurrent);
provide('setSchema', setSchema);
provide('addSchema', addSchema);
provide('setZIndex', setZIndex);
</script>
<style scoped lang="scss">
.panel-canvas-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  background-color: var(--el-border-color);

  .panel-canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .canvas-content {
    position: absolute;
    overflow: hidden;
    background-size: cover;
    z-index: 5;
  }
}
</style>
