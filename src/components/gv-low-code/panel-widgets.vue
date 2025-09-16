<template>
  <div class="panel-widgets">
    <el-scrollbar>
      <glc-widget-image-target />
      <glc-widget-text-target />
      <slot />
    </el-scrollbar>
  </div>
</template>
<script>
export default { name: 'glc-panel-widgets' };
</script>
<script setup>
import GlcWidgetImageTarget from './_widgets/image-target.vue';
import GlcWidgetTextTarget from './_widgets/text-target.vue';
</script>
<style scoped>
.panel-widgets {
  position: absolute;
  top: 10%;
  bottom: 10%;
  left: 20px;
  width: 200px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  z-index: 10;
}
</style>
