<template>
  <div class="download-pc">
    <gv-download-app-panel class="panel-wrap" :config="config" />
  </div>
</template>
<script setup>
import { shallowRef } from 'vue';
import { useAppConfig } from '@/hooks/app-config';
import GvDownloadAppPanel from '@/components/gv-download-app/panel.vue';

const config = shallowRef(useAppConfig({}));
</script>
<style lang="scss" scoped>
.download-pc {
  padding-top: 10vh;
  min-height: 100%;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);

  .panel-wrap {
    width: 800px;
    margin: 0 auto;
  }
}
</style>
