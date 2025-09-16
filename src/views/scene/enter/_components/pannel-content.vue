<template>
  <div class="pannel-content flex-col" :style="panelContentStyle">
    <pannel-content-current />
    <pannel-content-opeate class="mb-12" />
    <pannel-content-amount class="flex-1" />
  </div>
</template>
<script setup>
import PannelContentCurrent from '@/views/scene/enter/_components/pannel-content-current.vue';
import PannelContentOpeate from '@/views/scene/enter/_components/pannel-content-opeate.vue';
import PannelContentAmount from '@/views/scene/enter/_components/pannel-content-amount.vue';
import { panelContentStyle } from '@/views/scene/enter/_models/enter-layout';
</script>
<style lang="scss" scoped>
.pannel-content {
  position: absolute;
  top: var(--scene-enter-main-padding-panel);
  bottom: var(--scene-enter-main-padding-panel);
  z-index: 10;
}
</style>
