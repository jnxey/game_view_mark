<template>
  <el-menu class="menu-list" :default-active="activeMenu" :collapse="systemState.menuCollapse">
    <menu-item v-for="route in routes" :key="route.id" :route="route" :route-path="route.path" first />
  </el-menu>
</template>
<script setup>
import { systemState } from '@/store/system.js';
import MenuItem from '@/views/layout/_components/menu-item.vue';
import { computed } from 'vue';
import { managerState } from '@/store/manager.js';
import { useRoute } from 'vue-router';

const routes = computed(() => {
  return managerState.routes ?? [];
});

const route = useRoute();
const activeMenu = computed(() => route.meta?.activeMenu || route.path);
</script>
<style lang="scss">
.el-menu.menu-list {
  border-right: none;
  .el-menu-item {
    border-color: transparent;
    &.is-active {
      background-color: var(--el-color-primary-light-9);
      border-right: 2px solid var(--el-color-primary);
    }
  }
  .el-menu-item:hover,
  .el-sub-menu__title:hover {
    color: var(--el-color-primary);
  }
}
</style>
