<template>
  <el-tooltip :content="$t('common.refresh_btn')" placement="bottom">
    <div class="header-refresh header-item cursor-pointer" @click="refresh">
      <gv-icon name="el-icon-refresh-right" />
    </div>
  </el-tooltip>
</template>
<script setup>
import GvIcon from '@/components/gv-icon/index.vue';
import { pageReload } from '@/tools';
import { $t } from '@/lang/i18n';

const refresh = () => {
  pageReload();
};
</script>
<style scoped lang="scss">
@use '../_style/index.scss';
</style>
