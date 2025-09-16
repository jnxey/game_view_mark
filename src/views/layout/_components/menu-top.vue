<template>
  <el-header class="flex-row align-center justify-center" :height="getPX(LAYOUT_HEADER_HEIGHT)">
    <img v-if="!!webLogo" class="logo" :src="webLogo" alt="" />
    <span class="title ml-4 fz-18 fw-bold" v-if="!systemState.menuCollapse">{{ webName }}</span>
  </el-header>
</template>
<script setup>
import { LAYOUT_HEADER_HEIGHT } from '@/values';
import { getBaseImagUrl, getPX } from '@/tools';
import { systemState } from '@/store/system.js';
import logo from '@/assets/images/layout/logo.png';
import { computed } from 'vue';

const webLogo = computed(() => (!!systemState.config.web_logo ? getBaseImagUrl(systemState.config.web_logo) : logo));
const webName = computed(() => systemState.config.web_name);
</script>
<style scoped lang="scss">
.logo {
  width: 40px;
  height: 40px;
}
</style>
