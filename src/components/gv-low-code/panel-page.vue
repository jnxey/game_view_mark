<template>
  <div
    class="panel-page"
    :style="{
      backgroundImage: `url(${windowConfig.backgroundImage})`,
      backgroundColor: windowConfig.backgroundColor,
      backgroundSize: 'cover'
    }"
  >
    <div
      class="panel-content"
      :style="{
        width: getPX(windowConfig.width),
        height: getPX(windowConfig.height),
        ...windowScale
      }"
    >
      <glc-panel-render />
    </div>
  </div>
</template>
<script>
export default { name: 'glc-panel-page' };
</script>
<script setup>
import { computed, provide, reactive, ref, shallowRef } from 'vue';
import GlcPanelRender from '@/components/gv-low-code/panel-render.vue';
import { GLC_COLORS } from '@/components/gv-low-code/_models';
import { getPX, getWindowSize } from '@/tools';

const fakerCurrent = ref();
const extendData = shallowRef();
const schema = reactive([]);

const windowConfig = reactive({
  width: 1920,
  height: 1080,
  backgroundImage: '',
  backgroundColor: GLC_COLORS.white
});

const windowScale = computed(() => {
  const window = getWindowSize();
  const radioWidth = window.width / windowConfig.width;
  const radioHeight = window.height / windowConfig.height;
  const radio = Math.min(radioWidth, radioHeight);
  return { transform: `scale(${radio},${radio})`, transformOrigin: 'center' };
});

const setConfig = (config, extend) => {
  Object.keys(config.window).forEach((name) => {
    windowConfig[name] = config.window[name];
  });
  schema.push(...(config.schema ?? []));
  extendData.value = extend;
};

defineExpose({ setConfig });

provide('extendData', extendData);
provide('schema', schema);
//
provide('windowConfig', windowConfig);
provide('setWindowConfig', () => {});
provide('isEnterSpace', false);
provide('current', fakerCurrent);
provide('setCurrent', () => {});
provide('setSchema', () => {});
provide('setZIndex', () => {});
</script>
<style lang="scss" scoped>
.panel-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .panel-content {
    position: relative;
    flex-shrink: 0;
  }

  ::v-deep(.hit-box.is-hover) {
    .box {
      border: none;
    }
  }
}
</style>
