<template>
  <el-container class="common-layout" v-if="managerState.user">
    <el-aside class="aside-wrap" :width="menuCollapseWidth">
      <el-scrollbar>
        <div class="aside-content">
          <menu-top />
          <menu-list />
        </div>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="header-wrap flex-row align-center justify-end" :height="getPX(LAYOUT_HEADER_HEIGHT)">
        <div class="collapse-button flex-row align-center justify-center cursor-pointer" @click="toggleCollapseState()">
          <gv-icon v-if="!systemState.menuCollapse" name="local-icon-collapse" class="fz-18" />
          <gv-icon v-else name="local-icon-expand" class="fz-18" />
        </div>
        <header-refresh />
        <header-chat />
        <header-fullscreen />
        <header-language />
        <header-setting />
        <header-avatar />
      </el-header>
      <tabs-multiple />
      <el-main class="main-wrap">
        <router-view v-slot="{ Component }">
          <keep-alive :max="10" :exclude="excludeList">
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import MenuList from '@/views/layout/_components/menu-list.vue';
import MenuTop from '@/views/layout/_components/menu-top.vue';
import { CACHE_VALUE, LAYOUT_HEADER_HEIGHT } from '@/values';
import { checkIndexArray, getPX } from '@/tools';
import { menuCollapseWidth, toggleCollapseState } from '@/views/layout/_store/collapse.js';
import HeaderAvatar from '@/views/layout/_components/header-avatar.vue';
import HeaderFullscreen from '@/views/layout/_components/header-fullscreen.vue';
import { systemState } from '@/store/system.js';
import { managerState } from '@/store/manager.js';
import GvIcon from '@/components/gv-icon/index.vue';
import TabsMultiple from '@/views/layout/_components/tabs-multiple.vue';
import HeaderSetting from '@/views/layout/_components/header-setting.vue';
import HeaderRefresh from '@/views/layout/_components/header-refresh.vue';
import HeaderLanguage from '@/views/layout/_components/header-language.vue';
import HeaderChat from '@/views/layout/_components/header-chat.vue';

const excludeList = ['no-cache-desk-road', 'no-cache-game-data-risk'];
</script>
<style scoped lang="scss">
$aside-bottom-height: 50px;

.common-layout {
  width: 100vw;
  height: 100vh;
  padding-top: var(--gv-status-bar-height, 0);
  .aside-wrap {
    position: relative;
    box-shadow: var(--gv-box-shadow-right);
    transition: width 0.3s;
  }

  .header-wrap {
    position: relative;
    box-shadow: var(--gv-box-shadow-bottom);

    .collapse-button {
      position: absolute;
      left: 0;
      width: 60px;
      height: 100%;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }

  .main-wrap {
    --el-main-padding: 15px;
    background-color: var(--el-bg-color-page);
  }
}
</style>
