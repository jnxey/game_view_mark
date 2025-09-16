<template>
  <el-tooltip :content="tooltip" placement="bottom">
    <div class="header-fullscreen header-item cursor-pointer" @click="toggle">
      <gv-icon v-if="!isFullscreen" name="local-icon-fullscreen" />
      <gv-icon v-else name="local-icon-fullscreen-exit" />
    </div>
  </el-tooltip>
</template>
<script setup>
import { useListenerFullscreen } from '@/hooks/fullscreen.js';
import GvIcon from '@/components/gv-icon/index.vue';

const { isFullscreen, tooltip, toggle } = useListenerFullscreen();
</script>
<style scoped lang="scss">
@use '../_style/index.scss';
</style>
