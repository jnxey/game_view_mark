<template>
  <el-dropdown class="h-full">
    <div class="header-item cursor-pointer">
      <gv-icon name="local-icon-language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in languageSupport" :key="item.code" @click="languageSet(item.code)">
          <span :class="{ 'text-primary': languageCurrent === item.code }">{{ item.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { languageCurrent, languageSet, languageSupport } from '@/lang';
</script>
<style scoped lang="scss">
@use '../_style/index.scss';
</style>
